"""
FindIt AI Matching Service
FastAPI service that computes semantic similarity between lost and found items.

Text similarity: Sentence Transformers (all-MiniLM-L6-v2)
Image similarity: CLIP embeddings (optional, requires torch + transformers)
Location: Token overlap scoring
Date: Time-decay scoring

Run:
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
"""

import os
import re
import math
import logging
from datetime import datetime, timezone
from typing import Optional
from contextlib import asynccontextmanager

import numpy as np
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("findit-ai")

# ── Config ─────────────────────────────────────────────────────────────────────
TEXT_MODEL_NAME = os.getenv("TEXT_MODEL", "all-MiniLM-L6-v2")
ENABLE_CLIP = os.getenv("ENABLE_CLIP", "0") == "1"
MATCH_THRESHOLD = float(os.getenv("MATCH_THRESHOLD", "0.20"))

# ── Model loading (lazy, at startup) ───────────────────────────────────────────
text_model = None
clip_model = None
clip_processor = None


def load_text_model():
    global text_model
    try:
        from sentence_transformers import SentenceTransformer
        logger.info(f"Loading text model: {TEXT_MODEL_NAME}")
        text_model = SentenceTransformer(TEXT_MODEL_NAME)
        logger.info("Text model loaded")
    except Exception as e:
        logger.warning(f"Failed to load text model: {e}. Text similarity will use keyword fallback.")
        text_model = None


def load_clip_model():
    global clip_model, clip_processor
    if not ENABLE_CLIP:
        logger.info("CLIP disabled (set ENABLE_CLIP=1 to enable image similarity)")
        return
    try:
        from transformers import CLIPModel, CLIPProcessor
        logger.info("Loading CLIP model...")
        clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        logger.info("CLIP model loaded")
    except Exception as e:
        logger.warning(f"Failed to load CLIP: {e}. Image similarity disabled.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_text_model()
    load_clip_model()
    yield


app = FastAPI(
    title="FindIt AI Service",
    description="Computes similarity scores between lost and found items",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ─────────────────────────────────────────────────────────────
class ItemPayload(BaseModel):
    title: str = Field(default="")
    description: str = Field(default="")
    category: str = Field(default="")
    identifying_features: str = Field(default="")
    image_url: str = Field(default="")
    location: str = Field(default="")
    date: Optional[str] = Field(default=None)


class MatchRequest(BaseModel):
    lost: ItemPayload
    found: ItemPayload


class ComponentScores(BaseModel):
    text: float
    image: float
    location: float
    date: float


class MatchResponse(BaseModel):
    overall_score: float
    component_scores: ComponentScores
    method: str
    details: dict


# ── Utility functions ───────────────────────────────────────────────────────────
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def keyword_text_score(text_a: str, text_b: str) -> float:
    """Jaccard similarity on word tokens as a fallback."""
    def tokenize(s):
        return set(re.sub(r"[^a-z0-9\s]", " ", s.lower()).split())
    a, b = tokenize(text_a), tokenize(text_b)
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union > 0 else 0.0


def semantic_text_score(text_a: str, text_b: str) -> tuple[float, str]:
    """Sentence transformer cosine similarity. Falls back to keyword score."""
    if not text_a.strip() or not text_b.strip():
        return 0.0, "empty"
    if text_model is None:
        score = keyword_text_score(text_a, text_b)
        return score, "keyword_fallback"
    try:
        emb_a = text_model.encode(text_a, normalize_embeddings=True)
        emb_b = text_model.encode(text_b, normalize_embeddings=True)
        score = cosine_similarity(np.array(emb_a), np.array(emb_b))
        # Sentence transformers return scores in [-1,1]; normalise to [0,1]
        score = (score + 1) / 2
        return float(score), "sentence_transformer"
    except Exception as e:
        logger.warning(f"Text embedding failed: {e}")
        return keyword_text_score(text_a, text_b), "keyword_fallback"


def location_score(loc_a: str, loc_b: str) -> float:
    """Token overlap between location strings."""
    if not loc_a or not loc_b:
        return 0.0
    def tokenize(s):
        return set(re.sub(r"[^a-z0-9\s]", " ", s.lower()).split())
    a, b = tokenize(loc_a), tokenize(loc_b)
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union > 0 else 0.0


def date_score(date_a: Optional[str], date_b: Optional[str], max_days: float = 30.0) -> float:
    """Exponential time-decay: 1.0 at 0 days, ~0.0 at max_days."""
    if not date_a or not date_b:
        return 0.5  # neutral when date unknown
    try:
        def parse_date(s):
            # Try ISO formats, always take first 10 chars for plain date
            for fmt in ["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"]:
                try:
                    return datetime.strptime(s[:len(fmt)], fmt)
                except (ValueError, TypeError):
                    pass
            # Last resort: just parse YYYY-MM-DD prefix
            try:
                return datetime.strptime(s[:10], "%Y-%m-%d")
            except Exception:
                return None

        dt_a = parse_date(date_a)
        dt_b = parse_date(date_b)
        if dt_a is None or dt_b is None:
            return 0.5
        diff_days = abs((dt_a - dt_b).days)
        return float(math.exp(-diff_days / max_days))
    except Exception:
        return 0.5


async def image_score(url_a: str, url_b: str) -> tuple[float, str]:
    """CLIP image embedding similarity. Returns 0 with reason if unavailable."""
    if not ENABLE_CLIP or clip_model is None or clip_processor is None:
        return 0.0, "clip_disabled"
    if not url_a or not url_b:
        return 0.0, "no_image"
    # Validate URLs are http/https to prevent SSRF
    if not url_a.startswith(("http://", "https://")) or not url_b.startswith(("http://", "https://")):
        return 0.0, "invalid_url"
    try:
        import torch
        from PIL import Image
        import io

        async with httpx.AsyncClient(timeout=10.0, follow_redirects=False) as client:
            resp_a = await client.get(url_a)
            resp_b = await client.get(url_b)
            if resp_a.status_code != 200 or resp_b.status_code != 200:
                return 0.0, "fetch_failed"
            img_a = Image.open(io.BytesIO(resp_a.content)).convert("RGB")
            img_b = Image.open(io.BytesIO(resp_b.content)).convert("RGB")

        with torch.no_grad():
            inputs_a = clip_processor(images=img_a, return_tensors="pt")
            inputs_b = clip_processor(images=img_b, return_tensors="pt")
            emb_a = clip_model.get_image_features(**inputs_a).numpy()[0]
            emb_b = clip_model.get_image_features(**inputs_b).numpy()[0]

        score = cosine_similarity(emb_a, emb_b)
        score = (score + 1) / 2  # normalise to [0,1]
        return float(score), "clip"
    except Exception as e:
        logger.warning(f"Image scoring failed: {e}")
        return 0.0, f"error: {e}"


def build_text_input(item: ItemPayload) -> str:
    """Concatenate item text fields for embedding."""
    parts = [item.title, item.category, item.description, item.identifying_features]
    return " ".join(p for p in parts if p.strip())


# ── Endpoints ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "text_model": TEXT_MODEL_NAME if text_model else "keyword_fallback",
        "clip_enabled": ENABLE_CLIP and clip_model is not None,
    }


@app.post("/match", response_model=MatchResponse)
async def compute_match(req: MatchRequest):
    lost, found = req.lost, req.found

    # ── Text similarity ───────────────────────────────────────────────────────
    lost_text = build_text_input(lost)
    found_text = build_text_input(found)
    t_score, t_method = semantic_text_score(lost_text, found_text)

    # ── Image similarity ──────────────────────────────────────────────────────
    i_score, i_method = await image_score(lost.image_url, found.image_url)

    # ── Location similarity ───────────────────────────────────────────────────
    l_score = location_score(lost.location, found.location)

    # ── Date similarity ───────────────────────────────────────────────────────
    d_score = date_score(lost.date, found.date)

    # ── Category bonus ────────────────────────────────────────────────────────
    category_match = lost.category.lower() == found.category.lower() and bool(lost.category)

    # ── Weighted combination ──────────────────────────────────────────────────
    # Adjust weights based on data availability
    weights = {"text": 0.40, "image": 0.30, "location": 0.20, "date": 0.10}
    if i_score == 0.0:
        # Redistribute image weight to text and location
        weights["text"] += weights["image"] * 0.6
        weights["location"] += weights["image"] * 0.4
        weights["image"] = 0.0

    overall = (
        weights["text"] * t_score +
        weights["image"] * i_score +
        weights["location"] * l_score +
        weights["date"] * d_score
    )

    # Apply category bonus
    if category_match:
        overall = min(1.0, overall * 1.15)

    overall = round(float(overall), 4)

    return MatchResponse(
        overall_score=overall,
        component_scores=ComponentScores(
            text=round(t_score, 4),
            image=round(i_score, 4),
            location=round(l_score, 4),
            date=round(d_score, 4),
        ),
        method=t_method,
        details={
            "text_method": t_method,
            "image_method": i_method,
            "category_bonus": category_match,
            "weights_used": weights,
        },
    )

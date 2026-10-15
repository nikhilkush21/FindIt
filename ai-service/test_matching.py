"""
Basic tests for the AI matching service.
Run: python test_matching.py (does not require a running server)
"""

import sys
import math

# Test the pure-Python scoring functions directly (no FastAPI needed)
sys.path.insert(0, '.')

def test_location_score():
    from main import location_score
    assert location_score("Library Block A", "Library Block A") == 1.0
    assert location_score("Library", "Canteen") < 0.5
    assert location_score("", "Library") == 0.0
    print("✓ location_score tests passed")

def test_date_score():
    from main import date_score
    same_day = date_score("2024-01-10", "2024-01-10")
    assert same_day > 0.99, f"Expected ~1.0, got {same_day}"
    far_apart = date_score("2024-01-01", "2024-06-01")
    assert far_apart < 0.1, f"Expected < 0.1, got {far_apart}"
    neutral = date_score(None, None)
    assert neutral == 0.5, f"Expected 0.5 for None dates, got {neutral}"
    print("✓ date_score tests passed")

def test_keyword_text_score():
    from main import keyword_text_score
    s = keyword_text_score("black leather wallet", "black leather wallet")
    assert s == 1.0, f"Expected 1.0, got {s}"
    s2 = keyword_text_score("black iPhone 14", "red Samsung Galaxy")
    assert s2 < 0.3, f"Expected < 0.3, got {s2}"
    empty = keyword_text_score("", "")
    assert empty == 0.0
    print("✓ keyword_text_score tests passed")

def test_cosine_similarity():
    import numpy as np
    from main import cosine_similarity
    a = np.array([1.0, 0.0, 0.0])
    b = np.array([1.0, 0.0, 0.0])
    assert abs(cosine_similarity(a, b) - 1.0) < 1e-6
    c = np.array([0.0, 1.0, 0.0])
    assert abs(cosine_similarity(a, c)) < 1e-6
    zero = np.array([0.0, 0.0, 0.0])
    assert cosine_similarity(a, zero) == 0.0
    print("✓ cosine_similarity tests passed")

def test_build_text_input():
    from main import build_text_input, ItemPayload
    item = ItemPayload(
        title="Black iPhone 14",
        description="Lost near library",
        category="Electronics",
        identifying_features="cracked screen",
    )
    text = build_text_input(item)
    assert "Black iPhone 14" in text
    assert "Electronics" in text
    assert "cracked screen" in text
    print("✓ build_text_input tests passed")

if __name__ == "__main__":
    print("Running AI service unit tests...\n")
    try:
        test_cosine_similarity()
        test_keyword_text_score()
        test_location_score()
        test_date_score()
        test_build_text_input()
        print("\n✓ All tests passed")
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        sys.exit(1)

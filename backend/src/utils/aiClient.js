const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT = parseInt(process.env.AI_SERVICE_TIMEOUT_MS || '10000', 10);

/**
 * Call the AI matching service.
 * Returns null if the service is unavailable (graceful fallback).
 */
async function computeMatch(lostItem, foundItem) {
  try {
    const payload = {
      lost: {
        title: lostItem.title,
        description: lostItem.description,
        category: lostItem.category,
        identifying_features: lostItem.identifyingFeatures || '',
        image_url: lostItem.images?.[0] || '',
        location: lostItem.location,
        date: lostItem.date,
      },
      found: {
        title: foundItem.title,
        description: foundItem.description,
        category: foundItem.category,
        identifying_features: foundItem.identifyingFeatures || '',
        image_url: foundItem.images?.[0] || '',
        location: foundItem.location,
        date: foundItem.date,
      },
    };

    const { data } = await axios.post(`${AI_URL}/match`, payload, { timeout: TIMEOUT });
    return { success: true, data };
  } catch (err) {
    const msg = err.code === 'ECONNREFUSED'
      ? 'AI service unavailable'
      : err.message;
    console.warn('[AI Client]', msg);
    return { success: false, error: msg };
  }
}

/**
 * Keyword-based fallback matching when AI is unavailable.
 * Returns scores between 0 and 1.
 */
function fallbackMatch(lostItem, foundItem) {
  // Category match
  const categoryMatch = lostItem.category === foundItem.category ? 1 : 0;

  // Simple token overlap for text
  function tokenize(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  }
  const lostTokens = new Set([
    ...tokenize(lostItem.title),
    ...tokenize(lostItem.description),
    ...tokenize(lostItem.identifyingFeatures),
  ]);
  const foundTokens = new Set([
    ...tokenize(foundItem.title),
    ...tokenize(foundItem.description),
    ...tokenize(foundItem.identifyingFeatures),
  ]);
  const intersection = [...lostTokens].filter((t) => foundTokens.has(t)).length;
  const union = new Set([...lostTokens, ...foundTokens]).size;
  const textScore = union > 0 ? intersection / union : 0;

  // Location token overlap
  const lostLoc = new Set(tokenize(lostItem.location));
  const foundLoc = new Set(tokenize(foundItem.location));
  const locIntersect = [...lostLoc].filter((t) => foundLoc.has(t)).length;
  const locUnion = new Set([...lostLoc, ...foundLoc]).size;
  const locationScore = locUnion > 0 ? locIntersect / locUnion : 0;

  // Date proximity score (within 30 days = max)
  let dateScore = 0;
  try {
    const diff = Math.abs(new Date(lostItem.date) - new Date(foundItem.date));
    const days = diff / (1000 * 60 * 60 * 24);
    dateScore = Math.max(0, 1 - days / 30);
  } catch (_) {}

  // Weighted combination (no image in fallback)
  const weights = { text: 0.45, location: 0.35, date: 0.2 };
  const overall =
    weights.text * textScore +
    weights.location * locationScore +
    weights.date * dateScore;

  // Boost if same category
  const boosted = Math.min(1, overall * (1 + categoryMatch * 0.15));

  return {
    overall_score: parseFloat(boosted.toFixed(4)),
    component_scores: {
      text: parseFloat(textScore.toFixed(4)),
      image: 0,
      location: parseFloat(locationScore.toFixed(4)),
      date: parseFloat(dateScore.toFixed(4)),
    },
    method: 'keyword_fallback',
  };
}

module.exports = { computeMatch, fallbackMatch };

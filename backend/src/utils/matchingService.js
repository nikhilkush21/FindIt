const Item = require('../models/Item');
const Match = require('../models/Match');
const { computeMatch, fallbackMatch } = require('./aiClient');
const { createNotification } = require('./notifications');

const MATCH_THRESHOLD = 0.25; // only save matches above this score

/**
 * Find and save all potential matches for a newly reported item.
 * Called after an item is created or updated.
 */
async function findMatchesForItem(item) {
  try {
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';

    // Find candidate items: same category, open status, approved
    const candidates = await Item.find({
      type: oppositeType,
      category: item.category,
      status: 'open',
      moderationStatus: 'approved',
      isDeleted: false,
      _id: { $ne: item._id },
    })
      .limit(50)
      .lean();

    for (const candidate of candidates) {
      const lostItem = item.type === 'lost' ? item : candidate;
      const foundItem = item.type === 'found' ? item : candidate;

      // Skip if match already computed
      const existing = await Match.findOne({ lostItem: lostItem._id, foundItem: foundItem._id });
      if (existing) continue;

      await computeAndSaveMatch(lostItem, foundItem);
    }
  } catch (err) {
    console.error('[MatchingService] findMatchesForItem error:', err.message);
  }
}

/**
 * Compute a match score between a lost and found item and persist it.
 */
async function computeAndSaveMatch(lostItem, foundItem) {
  const matchDoc = await Match.findOneAndUpdate(
    { lostItem: lostItem._id, foundItem: foundItem._id },
    { aiStatus: 'processing' },
    { upsert: true, new: true }
  );

  try {
    // Try AI service first
    const aiResult = await computeMatch(lostItem, foundItem);

    let scores, method;
    if (aiResult.success) {
      scores = aiResult.data;
      method = 'ai';
    } else {
      scores = fallbackMatch(lostItem, foundItem);
      method = 'fallback';
    }

    const overall = scores.overall_score || 0;
    if (overall < MATCH_THRESHOLD) {
      await matchDoc.deleteOne();
      return null;
    }

    matchDoc.overallScore = overall;
    matchDoc.componentScores = {
      text: scores.component_scores?.text || 0,
      image: scores.component_scores?.image || 0,
      location: scores.component_scores?.location || 0,
      date: scores.component_scores?.date || 0,
    };
    matchDoc.aiStatus = method === 'ai' ? 'completed' : 'fallback';
    matchDoc.computedAt = new Date();
    await matchDoc.save();

    // Notify reporters of high-confidence matches (score >= 0.5)
    if (overall >= 0.5) {
      const lostFull = await Item.findById(lostItem._id);
      const foundFull = await Item.findById(foundItem._id);

      if (lostFull && foundFull && lostFull.reportedBy.toString() !== foundFull.reportedBy.toString()) {
        await createNotification({
          recipient: lostFull.reportedBy,
          type: 'match_found',
          title: 'Potential match found!',
          message: `A found item "${foundFull.title}" may match your lost "${lostFull.title}" (${Math.round(overall * 100)}% similarity).`,
          relatedItem: foundFull._id,
        });
      }
    }

    return matchDoc;
  } catch (err) {
    matchDoc.aiStatus = 'failed';
    matchDoc.aiError = err.message;
    await matchDoc.save();
    console.error('[MatchingService] computeAndSaveMatch error:', err.message);
    return null;
  }
}

module.exports = { findMatchesForItem, computeAndSaveMatch };

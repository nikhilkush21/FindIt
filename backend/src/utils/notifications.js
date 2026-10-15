const Notification = require('../models/Notification');

/**
 * Create an in-app notification.
 */
async function createNotification({ recipient, type, title, message, relatedItem, relatedClaim }) {
  try {
    await Notification.create({ recipient, type, title, message, relatedItem, relatedClaim });
  } catch (err) {
    console.error('[Notifications] Failed to create notification:', err.message);
  }
}

module.exports = { createNotification };

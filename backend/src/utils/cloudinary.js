const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Check if Cloudinary is configured
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Cloudinary storage
const cloudinaryStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'findit-items',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
      },
    })
  : null;

// Fallback: local disk storage
const localStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
};

const upload = multer({
  storage: cloudinaryStorage || localStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
});

/**
 * Delete an image from Cloudinary by URL.
 * Silently fails if not configured or URL is local.
 */
async function deleteImage(imageUrl) {
  if (!isCloudinaryConfigured || !imageUrl) return;
  try {
    // Extract public_id from Cloudinary URL
    const parts = imageUrl.split('/');
    const file = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${file.split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('[Cloudinary] Failed to delete image:', err.message);
  }
}

module.exports = { upload, deleteImage, isCloudinaryConfigured };

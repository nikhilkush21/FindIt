const { z } = require('zod');

const CATEGORIES = [
  'Electronics', 'Wallet/Purse', 'ID/Cards', 'Keys',
  'Bag', 'Clothing', 'Jewelry', 'Books/Documents',
  'Accessories', 'Other',
];

const createItemSchema = z.object({
  type: z.enum(['lost', 'found'], { required_error: 'Type must be lost or found' }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.enum(CATEGORIES).default('Other'),
  location: z.string().min(2, 'Location is required').max(200),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  identifyingFeatures: z.string().max(500).optional().default(''),
  status: z.enum(['open', 'claimed', 'resolved', 'expired']).optional().default('open'),
});

const updateItemSchema = createItemSchema.partial();

const claimSchema = z.object({
  message: z.string().min(10, 'Please describe why this item is yours').max(1000),
  verificationAnswers: z
    .array(
      z.object({
        question: z.string().max(200),
        answer: z.string().max(500),
      })
    )
    .optional()
    .default([]),
});

const reviewClaimSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reviewNote: z.string().max(500).optional().default(''),
});

module.exports = {
  createItemSchema,
  updateItemSchema,
  claimSchema,
  reviewClaimSchema,
  CATEGORIES,
};

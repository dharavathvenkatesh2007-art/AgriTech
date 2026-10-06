import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { detectDisease, getDiseaseHistory } from '../controllers/diseaseController.js';

const router = express.Router();

// Multer memory storage configuration with 10 MB file size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, JPEG, PNG) are allowed'), false);
    }
  }
});

// Helper middleware to handle single or multiple 'image' or 'images' fields
const uploadImagesMiddleware = upload.array('image', 3);

// @desc    Detect plant disease using Pl@ntNet API
// @route   POST /api/disease/detect
// @access  Private
router.post('/detect', protect, uploadImagesMiddleware, detectDisease);

// @desc    Get disease scan history for current authenticated farmer
// @route   GET /api/disease/history
// @access  Private
router.get('/history', protect, getDiseaseHistory);

export default router;

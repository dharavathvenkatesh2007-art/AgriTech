import express from 'express';
import multer from 'multer';
import { synthesizeSpeech, transcribeSpeech } from '../services/voiceService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (buffer only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// @desc    Synthesize text to speech
// @route   POST /api/voice/tts
// @access  Public
router.post('/tts', async (req, res) => {
  const { text, language } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Please provide text to synthesize' });
  }

  try {
    const audioUrl = await synthesizeSpeech(text, language || 'Telugu');
    res.json({ audioUrl });
  } catch (error) {
    console.error('TTS API error:', error);
    res.status(500).json({ message: 'Speech synthesis failed', error: error.message });
  }
});

// @desc    Transcribe speech to text
// @route   POST /api/voice/stt
// @access  Private
router.post('/stt', protect, upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded' });
  }

  try {
    const transcript = await transcribeSpeech(req.file.buffer);
    res.json({ transcript });
  } catch (error) {
    console.error('STT API error:', error);
    res.status(500).json({ message: 'Speech transcription failed', error: error.message });
  }
});

export default router;

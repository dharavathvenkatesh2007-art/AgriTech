import express from 'express';
import AIChatHistory from '../models/AIChatHistory.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';

// @desc    Chat with RAG-based AI Agricultural Assistant
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { query, language } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query string is required' });
    }

    const aiRes = await fetch(`${AI_SERVICE_URL}/rag-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!aiRes.ok) {
      throw new Error(`AI RAG Chat failed: ${aiRes.statusText}`);
    }

    const aiData = await aiRes.json();

    // Persist chat interaction in history
    const chatEntry = await AIChatHistory.create({
      farmer: req.farmerId,
      userMessage: query,
      assistantResponse: aiData.response,
      knowledgeSource: aiData.source || 'ICAR Agronomic Standard',
      confidence: aiData.confidence || 0.85,
      verifiedKnowledge: aiData.verified_knowledge || true,
      language: language || 'English',
    });

    res.json({
      ...aiData,
      chatId: chatEntry._id,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Error querying AI agricultural assistant', error: error.message });
  }
});

// @desc    Get AI Chat history for logged in farmer
// @route   GET /api/chat/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const history = await AIChatHistory.find({ farmer: req.farmerId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Submit farmer feedback on AI response
// @route   POST /api/chat/feedback
// @access  Private
router.post('/feedback', protect, async (req, res) => {
  try {
    const { chatId, rating, comment } = req.body;
    const entry = await AIChatHistory.findById(chatId);
    if (!entry) {
      return res.status(404).json({ message: 'Chat entry not found' });
    }

    entry.farmerFeedback = { rating, comment };
    await entry.save();
    res.json({ message: 'Feedback recorded', entry });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

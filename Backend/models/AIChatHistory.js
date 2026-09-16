import mongoose from 'mongoose';

const aiChatHistorySchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  assistantResponse: {
    type: String,
    required: true,
  },
  knowledgeSource: {
    type: String,
    default: 'ICAR Verified Agronomy Corpus',
  },
  confidence: {
    type: Number,
    default: 0.85,
  },
  verifiedKnowledge: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  farmerFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

const AIChatHistory = mongoose.model('AIChatHistory', aiChatHistorySchema);
export default AIChatHistory;

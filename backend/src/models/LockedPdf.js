import mongoose from 'mongoose';

const lockedPdfSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: true,
    index: true
  },
  encryptedContent: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['locked', 'unlocked'],
    default: 'locked'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('LockedPdf', lockedPdfSchema);

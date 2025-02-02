import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  sheetName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
recordSchema.index({ sheetName: 1, date: 1 });

export const Record = mongoose.model('Record', recordSchema);
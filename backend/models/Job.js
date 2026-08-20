const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  location: {
    type: String,
    default: 'Remote',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  interviewDate: {
    type: Date,
  },
  salary: {
    type: String,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Job', jobSchema);
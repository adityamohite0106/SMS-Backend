const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  studentId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Pre-save hook to generate student ID
studentSchema.pre('save', function(next) {
  if (!this.studentId) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.studentId = `STU${year}${random}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
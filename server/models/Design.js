const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  companyAndLocation: { type: String, required: true },
  description: { type: String, required: true },
});

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  percentage: { type: String, required: true },
});

const educationSchema = new mongoose.Schema({
  major: { type: String, required: true },
  university: { type: String, required: true },
});

const resumeSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  professionalTitle: { type: String, required: true },
  personalDescription: { type: String, required: true },
  refererName: { type: String, required: true },
  refererRole: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: true },
  address: { type: String, required: true },
  image:{ type: String, required: true },
  experiences: [experienceSchema],
  skills: [skillSchema],
  education: [educationSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' }, 
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

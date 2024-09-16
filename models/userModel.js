import mongoose from 'mongoose';

const userDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  department: { 
    type: String, 
    enum: ['HR', 'Engineer', 'Senior Developer', 'Director'],
    required: true
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    required: true
  }
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);

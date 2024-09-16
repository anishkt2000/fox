//import mongoose from 'mongoose';
const mongoose = require("mongoose")


const chatsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  document_name: { type: String, required: true },
  department: { type: String, required: true },
  chat_history: [{
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }]
});

module.exports = mongoose.model('Chats', chatsSchema);
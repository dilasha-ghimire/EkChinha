const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true 
    // Unique across both customers and vendors
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'vendor'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId, 
    // Customer and Vendor Id
    required: true,
    refPath: 'role' 
    // Dynamically references 'Customer' or 'Vendor' based on role value
  }
});

module.exports = mongoose.model('Credential', CredentialSchema);

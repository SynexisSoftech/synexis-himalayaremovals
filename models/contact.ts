import mongoose from 'mongoose';

// 1. Define the enum inside the model
enum ServiceRequired {
  HOUSE_REMOVAL = 'House Removal',
  OFFICE_RELOCATION = 'Office Relocation',
  PACKING = 'Packing',
  STORAGE = 'Storage',
  RUBBISH_REMOVAL = 'Rubbish Removal',
  INTERSTATE_MOVE = 'Interstate Move',
}

// 2. Define the schema
const contactSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  serviceRequired: {
    type: String,
    enum: Object.values(ServiceRequired),
    required: true,
  },
});

// 3. Create or reuse the model
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;

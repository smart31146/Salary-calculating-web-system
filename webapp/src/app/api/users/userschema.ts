import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: false },
  gender: { type: String, required: false },
  isStaff: { type: Boolean, required: false },
  isSuperAdmin: { type: Boolean, required: false },
  active: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
});

// Create a Mongoose model based on the schema
const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
export default Users;
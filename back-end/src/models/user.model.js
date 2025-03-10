import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
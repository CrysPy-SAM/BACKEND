import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String,
    required: true, 
    default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  coverImage: {
    type: String,   
    default: "https://www.example.com/default-cover.jpg",
    },
    watchHistory: [
        {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],   
    password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    },
    refreshToken: {
    type: String,
    default: null,
    },
    createdAt: {
    type: Date,
    default: Date.now,
    },
    updatedAt: {
    type: Date,
    default: Date.now,
    },
});

export const User = mongoose.model("User", userSchema);

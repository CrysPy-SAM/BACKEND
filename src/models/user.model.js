import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import becrypt from "bcryptjs";
// import { use } from "react";

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
  fullName: {
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hash the password before saving
    this.password = await becrypt.hash(this.password, 10);
    next();
}
);

userSchema.methods.isPasswaordCorrect =async function (password) 
{
  return await becrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToke = function () {
  return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName 
    },
     process.env.ACCESS_TOKEN_SECRET,
    {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
}
)
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
}

export const User = mongoose.model("User", userSchema);

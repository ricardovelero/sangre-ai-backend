const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    nif: { type: String, unique: true },
    street: { type: String },
    zipcode: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    company: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/, // Validación de email
    },
    password: { type: String, required: true },
    phone: { type: String },
    profileComplete: { type: Boolean, default: false },
    picture: {
      type: String,
      validate: {
        validator: function (value) {
          return /^https?:\/\/.+\..+$/.test(value);
        },
        message: "Invalid URL format",
      },
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

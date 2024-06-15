const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

const BlackListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

BlackListTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 }); // delete after 15 mins

const BlackListToken = mongoose.model("BlackListToken", BlackListTokenSchema);

module.exports = { RefreshToken, BlackListToken };

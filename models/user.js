const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ['GUEST', 'ADMIN'],
      default: 'GUEST'
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

module.exports = mongoose.model("user", schema);


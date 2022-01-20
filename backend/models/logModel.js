import mongoose from "mongoose";
const logSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: Number,
    },
    device: {
      type: String,
    },
    token_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserLog = mongoose.model("UserLog", logSchema);

export default UserLog;

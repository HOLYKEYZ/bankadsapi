import mongoose, { Schema } from "mongoose";

const apiKeySchema = new Schema({
  bankName: {
    type: String,
    required: true,
  }, // e.g., GTB, Access Bank

  apiKey: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);

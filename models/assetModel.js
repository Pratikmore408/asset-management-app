import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastTradingPrice: {
      type: Number,
      default: 0,
    },
    numberOfTransfers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;

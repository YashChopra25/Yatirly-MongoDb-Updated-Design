
import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Types.ObjectId,
      ref: "urls",
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    os: {
      type: String,
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const visitmodel = mongoose.model("visits", VisitSchema);
export default visitmodel;

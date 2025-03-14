import mongoose from "mongoose";
const URLSchema = new mongoose.Schema(
  {
    longURL: {
      type: String,
      required: true,
    },
    ShortURL: {
      type: String,
      required: true,
    },
    isQR: {
      type: Boolean,
      default: false,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    visits: [
      {
        type: mongoose.Types.ObjectId,
        ref: "visits",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const URLmodel = mongoose.model("url", URLSchema);
export default URLmodel;

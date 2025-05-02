import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    images: [
      {
        id: String,
        title: String,
        description: String,
        date: String,
        ipfsHash: String,
        ipfsUrl: String,
        pinataMetadata: Object,
        pinataContent: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

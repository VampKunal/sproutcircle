import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Gallery from "@/models/Gallery";
import { uploadToPinata, removeFromPinata } from "@/lib/pinata";
import mongoose from "mongoose";

function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid userId: Not a valid ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId") || session.user.id;

    const userId = toObjectId(userIdParam);
    if (userId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const gallery = await Gallery.findOne({ userId });
    return NextResponse.json({ images: gallery?.images || [] });
  } catch (error) {
    console.error("GET Gallery Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");
    const title = formData.get("title") || "Untitled";
    const description = formData.get("description") || "";

    if (!userId || !file) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const userObjectId = toObjectId(userId);

    const pinataResponse = await uploadToPinata(file, {
      title,
      description,
      userId,
      date: new Date().toISOString(),
    });

    await dbConnect();

    const newImage = {
      id: new Date().getTime().toString(),
      title,
      description,
      date: new Date().toISOString().split("T")[0],
      ipfsHash: pinataResponse.ipfsHash,
      ipfsUrl: pinataResponse.ipfsUrl,
      pinataMetadata: pinataResponse.pinataMetadata,
      pinataContent: pinataResponse.pinataContent,
    };

    const gallery = await Gallery.findOneAndUpdate(
      { userId: userObjectId },
      { $push: { images: newImage } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, images: gallery.images });
  } catch (error) {
    console.error("POST Gallery Error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const imageId = searchParams.get("imageId");

    if (!userId || !imageId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const userObjectId = toObjectId(userId);

    await dbConnect();

    const gallery = await Gallery.findOne({ userId: userObjectId });
    if (!gallery) return NextResponse.json({ message: "Gallery not found" }, { status: 404 });

    const image = gallery.images.find((img) => String(img.id) === String(imageId));
    if (!image) return NextResponse.json({ message: "Image not found" }, { status: 404 });

    if (image.ipfsHash) {
      try {
        await removeFromPinata(image.ipfsHash);
      } catch (err) {
        console.warn("Pinata removal failed:", err);
      }
    }

    const updatedGallery = await Gallery.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { images: { id: imageId } } },
      { new: true }
    );

    return NextResponse.json({ success: true, images: updatedGallery?.images || [] });
  } catch (error) {
    console.error("DELETE Gallery Error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

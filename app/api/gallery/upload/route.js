import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadToPinata } from "@/lib/pinata";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

    if (!file || !userId) {
      return NextResponse.json({ message: "Missing file or userId" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "File size exceeds 5MB limit" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
    }

    const result = await uploadToPinata(file, {
      title,
      description,
      userId,
    });

    return NextResponse.json({
      success: true,
      ipfsHash: result.ipfsHash,
      ipfsUrl: result.ipfsUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: error.message || "Failed to upload file" }, { status: 500 });
  }
}

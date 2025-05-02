import dbConnect from "@/lib/mongoose";
import Location from "@/models/Location";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const { userId, data } = await request.json();

  if (!userId || !data) {
    return NextResponse.json({ message: "Missing userId or data" }, { status: 400 });
  }

  try {

    const location = await Location.findOneAndUpdate(
      { userId },
      { data },
      { new: true, upsert: true } 
    );

    return NextResponse.json({ message: "Location created/updated successfully", location }, { status: 200 }); 
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    const location = await Location.findOne({ userId });

    if (!location) {
      return NextResponse.json({ message: "No location found" }, { status: 404 });
    }

    return NextResponse.json({ data: location.data }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


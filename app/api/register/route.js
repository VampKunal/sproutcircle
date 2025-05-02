
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    await dbConnect();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const user = await User.create({ name, email, password });

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

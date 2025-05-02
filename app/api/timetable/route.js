import dbConnect from "@/lib/mongoose";
import Timetable from "@/models/Timetable";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
  await dbConnect();

  try {
    const rawStudentId = request.nextUrl.searchParams.get("studentId");
    const studentId = rawStudentId?.trim(); 

    const query = studentId ? { studentId: new mongoose.Types.ObjectId(studentId) } : {};

    const timetables = await Timetable.find(query);
    return NextResponse.json({ timetables }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  const { studentId, day, time, subject } = await request.json();

  if (!studentId || !day || !time || !subject) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }

  try {
    const timetable = await Timetable.findOneAndUpdate(
      { studentId, day, time },
      { studentId, day, time, subject },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Timetable created/updated successfully", timetable }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const day = searchParams.get("day");
  const time = searchParams.get("time");

  if (!studentId || !day || !time) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }

  await dbConnect();

  try {
    const deleted = await Timetable.findOneAndDelete({ studentId, day, time });

    if (!deleted) {
      return NextResponse.json({ message: "Timetable not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Timetable deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  await dbConnect();
  const { studentId, day, oldTime, newTime, newSubject } = await request.json();

  if (!studentId || !day || !oldTime || !newTime || !newSubject) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }

  try {
    const updated = await Timetable.findOneAndUpdate(
      { studentId, day, time: oldTime },
      { time: newTime, subject: newSubject },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Timetable entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Timetable updated successfully", updated }, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

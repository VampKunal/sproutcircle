
import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",  
      required: true,
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: true,
    },
    time: {
      type: String,
      required: true, 
    },
    subject: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true }
);

const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);

export default Timetable;

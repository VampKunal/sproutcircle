"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/auth-context";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchTimetable();
    }
  }, [user]);

  const fetchTimetable = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/timetable?studentId=${user.id}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.timetables)) {
        setTimetable(data.timetables);
      } else {
        setError("No timetable data found.");
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setError("An error occurred while fetching the timetable.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTimetable = timetable.filter(
    (entry) => entry.day?.toLowerCase() === selectedDay.toLowerCase()
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 p-4 text-center text-green-700 text-xl font-bold">
            📅 Your Timetable
          </div>

         
          <div className="flex justify-center flex-wrap gap-2 p-4">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                className={`px-4 py-2 rounded-md font-semibold ${
                  selectedDay === day
                    ? "bg-green-600 text-white"
                    : "bg-green-200 text-green-800"
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

        
          <div className="p-6 flex flex-col items-center justify-center min-h-[40vh]">
            {loading ? (
              <div className="animate-spin text-4xl text-green-500 mb-4">⟳</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : filteredTimetable.length > 0 ? (
              <div className="w-full space-y-4">
                {filteredTimetable.map((entry) => (
                  <div
                    key={entry._id}
                    className="border rounded p-4 bg-green-50 shadow"
                  >
                    <h3 className="text-xl font-bold text-green-700">
                      {entry.subject}
                    </h3>
                    <p className="text-gray-700">Time: {entry.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg">No classes for {selectedDay}.</p>
            )}

            <button
              onClick={fetchTimetable}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

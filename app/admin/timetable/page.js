"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import AdminNavbar from "@/components/admin-navbar"

export default function AdminTimetable() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [timetableData, setTimetableData] = useState({})
  const [activeDay, setActiveDay] = useState("Monday")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchingTimetable, setFetchingTimetable] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const defaultDayStructure = () => [
    { time: "", subject: "New Subject", icon: "📘", color: "bg-gray-100 border-gray-300" }
  ]

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("/api/admin/students")
      const data = await res.json()
      setStudents(data)
      setLoading(false)
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) fetchTimetable(selectedStudent._id)
  }, [selectedStudent])

  const fetchTimetable = async (studentId) => {
    setFetchingTimetable(true)
    try {
      const res = await fetch(`/api/timetable?studentId=${studentId}`)
      const { timetables } = await res.json()

     
      const grouped = {}
      days.forEach((day) => (grouped[day] = []))

      timetables.forEach(({ day, time, subject }) => {
        grouped[day].push({ time, subject })
      })

      setTimetableData(grouped)
    } catch (e) {
      console.error("Fetch error:", e)
      setTimetableData({})
    } finally {
      setFetchingTimetable(false)
    }
  }

  const handleFieldChange = (index, field, value) => {
    const updated = { ...timetableData }
    updated[activeDay][index] = {
      ...updated[activeDay][index],
      [field]: value,
    }
    setTimetableData(updated)
  }

  const addEntry = () => {
    const updated = { ...timetableData }
    if (!updated[activeDay]) updated[activeDay] = []
    updated[activeDay].push({ time: "", subject: "New Subject" })
    setTimetableData(updated)
  }

  const removeEntry = (index) => {
    const updated = { ...timetableData }
    updated[activeDay].splice(index, 1)
    setTimetableData(updated)
  }

  const saveTimetable = async () => {
    if (!selectedStudent) return
    setSaving(true)
    setSuccessMessage("")

    const entries = timetableData[activeDay] || []

    try {
      await Promise.all(
        entries.map(({ time, subject }) =>
          fetch("/api/timetable", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId: selectedStudent._id,
              day: activeDay,
              time,
              subject,
            }),
          })
        )
      )

      setSuccessMessage("Timetable saved successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (e) {
      alert("Failed to save timetable")
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded shadow mb-6">
            <h1 className="text-2xl font-bold">Manage Timetable</h1>
            <p className="text-gray-600"> update the weekly timetable.</p>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Students</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student._id}
                      className={`block w-full px-3 py-2 rounded text-left ${
                        selectedStudent?._id === student._id ? "bg-blue-200" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      {student.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          
            <div className="bg-white p-6 rounded shadow md:col-span-3">
              {!selectedStudent ? (
                <p className="text-center text-gray-500">Select a student to begin</p>
              ) : fetchingTimetable ? (
                <p className="text-center text-gray-500">Loading timetable...</p>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Timetable for {selectedStudent.name}
                  </h2>

                  <div className="flex space-x-2 mb-4">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`px-4 py-2 rounded ${
                          activeDay === day ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {(timetableData[activeDay] || []).map((entry, index) => (
                    <div key={index} className="flex space-x-2 mb-2 items-center">
                      <input
                        className="border px-2 py-1 rounded w-32"
                        value={entry.time}
                        placeholder="Time"
                        onChange={(e) => handleFieldChange(index, "time", e.target.value)}
                      />
                      <input
                        className="border px-2 py-1 rounded flex-1"
                        value={entry.subject}
                        placeholder="Subject"
                        onChange={(e) => handleFieldChange(index, "subject", e.target.value)}
                      />
                      <button className="text-red-500" onClick={() => removeEntry(index)}>
                        Remove
                      </button>
                    </div>
                  ))}

                  <button onClick={addEntry} className="text-blue-600 mt-3">
                    + Add Period
                  </button>

                  <div className="mt-6">
                    <button
                      onClick={saveTimetable}
                      disabled={saving}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {saving ? "Saving..." : "Save Timetable"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

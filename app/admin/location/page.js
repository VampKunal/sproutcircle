"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import AdminNavbar from "@/components/admin-navbar"

export default function AdminLocation() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [updatingLocation, setUpdatingLocation] = useState(false)
  const [fetchingLocation, setFetchingLocation] = useState(false)

  // Sample locations for demonstration
  const locations = [
    { id: 1, name: "Classroom", emoji: "📚", description: "Learning about animals in the classroom!" },
    { id: 2, name: "Playground", emoji: "🏃", description: "Having fun with friends at the playground!" },
    { id: 3, name: "Cafeteria", emoji: "🍎", description: "Having a healthy lunch in the cafeteria!" },
    { id: 4, name: "Art Room", emoji: "🎨", description: "Making beautiful paintings in the art room!" },
    { id: 5, name: "Music Room", emoji: "🎵", description: "Learning new songs in the music room!" },
    { id: 6, name: "Library", emoji: "📖", description: "Reading interesting books in the library!" },
    { id: 7, name: "Gym", emoji: "🏀", description: "Playing sports in the gym!" },
    { id: 8, name: "Computer Lab", emoji: "💻", description: "Learning computer skills in the lab!" },
  ]

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/admin/students")
        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error)
        setError("Failed to load students. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Fetch location when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentLocation(selectedStudent._id)  // MongoDB _id
    }
  }, [selectedStudent])

  const fetchStudentLocation = async (userId) => {
    setFetchingLocation(true)
    try {
      const response = await fetch(`/api/location?userId=${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch location")
      }
      const data = await response.json()
      setSelectedLocation(data.location)  // MongoDB data for location
    } catch (error) {
      console.error("Error fetching location:", error)
      setSelectedLocation(null)
    } finally {
      setFetchingLocation(false)
    }
  }

  const updateStudentLocation = async () => {
    if (!selectedStudent || !selectedLocation) return

    setUpdatingLocation(true)

    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedStudent._id,  
          data: selectedLocation,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update location")
      }

      alert(`Location updated for ${selectedStudent.name} to ${selectedLocation.name}!`)
    } catch (error) {
      console.error("Error updating location:", error)
      alert("Failed to update location. Please try again.")
    } finally {
      setUpdatingLocation(false)
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Location Management</h1>
            <p className="text-gray-600">Update student locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Students</h2>

              {loading ? (
                <div className="text-center py-4">
                  <div className="text-green-500 text-4xl animate-spin mb-4 inline-block">⟳</div>
                  <p>Loading students...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student._id}  
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedStudent?._id === student._id ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      {student.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
              {!selectedStudent ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a student to update their location</p>
                </div>
              ) : fetchingLocation ? (
                <div className="text-center py-12">
                  <div className="text-green-500 text-4xl animate-spin mb-4 inline-block">⟳</div>
                  <p>Loading location...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-6">Update Location for {selectedStudent.name}</h2>

                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Current Location</h3>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-gray-600">
                        {selectedLocation ? (
                          <>
                            <span className="text-2xl mr-2">{selectedLocation.emoji}</span>
                            <span className="font-medium">{selectedLocation.name}</span>
                          </>
                        ) : (
                          "No location set"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Select New Location</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {locations.map((location) => (
                        <button
                          key={location.id}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            selectedLocation?.id === location.id ? "bg-green-100 border-green-300" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedLocation(location)}
                        >
                          <div className="text-3xl mb-1">{location.emoji}</div>
                          <div className="font-medium">{location.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={updateStudentLocation}
                    disabled={!selectedLocation || updatingLocation}
                  >
                    {updatingLocation ? "Updating..." : "Update Location"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

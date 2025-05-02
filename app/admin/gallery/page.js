"use client"

import { useState, useEffect, useRef } from "react"
import ProtectedRoute from "@/components/protected-route"
import AdminNavbar from "@/components/admin-navbar"
import Image from "next/image"

export default function AdminGallery() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageTitle, setImageTitle] = useState("")
  const [imageDescription, setImageDescription] = useState("")
  const [studentGallery, setStudentGallery] = useState([])
  const [fetchingGallery, setFetchingGallery] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [previewImage, setPreviewImage] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/admin/students")
        if (!response.ok) throw new Error("Failed to fetch students")
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

  useEffect(() => {
    if (selectedStudent) fetchStudentGallery(selectedStudent._id)
  }, [selectedStudent])

  const fetchStudentGallery = async (userId) => {
    setFetchingGallery(true)
    try {
      const response = await fetch(`/api/gallery?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch gallery")
      const data = await response.json()
      setStudentGallery(data.images || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
      setStudentGallery([])
    } finally {
      setFetchingGallery(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
      setUploadError(null)
    } else {
      setPreviewImage(null)
    }
  }

  const handleImageUpload = async (e) => {
    e.preventDefault()
    if (!selectedStudent || !fileInputRef.current.files[0]) return

    setUploadingImage(true)
    setSuccessMessage("")
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", fileInputRef.current.files[0])
      formData.append("userId", selectedStudent._id)
      formData.append("title", imageTitle)
      formData.append("description", imageDescription)

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to upload image")
      }

      const data = await response.json()
      setStudentGallery(data.images)
      setImageTitle("")
      setImageDescription("")
      setPreviewImage(null)
      fileInputRef.current.value = ""
      setSuccessMessage(`Image uploaded successfully for ${selectedStudent.name}!`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError(error.message || "Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!selectedStudent) return
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(
        `/api/gallery?userId=${selectedStudent._id}&imageId=${encodeURIComponent(imageId)}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete image")
      }

      const data = await response.json()
      setStudentGallery(data.images)
      setSuccessMessage(`Image deleted successfully from ${selectedStudent.name}'s gallery!`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting image:", error)
      alert(error.message || "Failed to delete image. Please try again.")
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gallery Management</h1>
            <p className="text-gray-600">Upload and manage images for students</p>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Students</h2>
              {loading ? (
                <div className="text-center py-4">Loading students...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
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
                <div className="text-center py-12 text-gray-500">Select a student</div>
              ) : fetchingGallery ? (
                <div className="text-center py-12">Loading gallery...</div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-6">Gallery for {selectedStudent.name}</h2>

                  <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-bold mb-3">Upload New Image</h3>
                    <form onSubmit={handleImageUpload}>
                      <input
                        type="text"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full border p-2 rounded mb-2"
                        required
                      />
                      <textarea
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full border p-2 rounded mb-2"
                        required
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="mb-2"
                        required
                      />
                      {previewImage && (
                        <Image
                          src={previewImage}
                          alt="Preview"
                          width={200}
                          height={150}
                          className="object-cover mb-2 rounded border"
                        />
                      )}
                      {uploadError && <div className="text-red-600 mb-2">{uploadError}</div>}
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </button>
                    </form>
                  </div>

                  <h3 className="font-bold mb-3">Existing Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentGallery.map((image) => (
                      <div key={String(image.id)} className="border rounded overflow-hidden">
                        <div className="aspect-video relative w-full h-48">
                          <Image
                            src={image.ipfsUrl || "/placeholder.svg"}
                            alt={image.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold">{image.title}</h4>
                          <p className="text-sm text-gray-600">{image.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{image.date}</span>
                            <button
                              onClick={() => handleDeleteImage(String(image.id))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

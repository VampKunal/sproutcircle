"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"

export default function UserGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery") // userId derived from session
        if (!res.ok) throw new Error("Failed to load images")
        const data = await res.json()

        setImages(data.images || [])
      } catch (err) {
        console.error("Gallery load error:", err)
        setError("Unable to load gallery.")
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Gallery</h1>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : images.length === 0 ? (
            <p className="text-gray-500">No images found.</p>
          ) : (
            <div className="flex flex-wrap gap-6 justify-start">
              {images.map((image) => (
                <div
                  key={image._id || image.id}
                  className="bg-white rounded shadow-md w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33%-1rem)] p-3"
                >
                  <div className="relative aspect-video mb-3">
                    <Image
                      src={image.ipfsUrl || image.url}
                      alt={image.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold">{image.title}</h3>
                  <p className="text-sm text-gray-600">{image.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{image.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

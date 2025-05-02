"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (adminOnly && user.role !== "admin") {
        router.push("/") 
      }
    }
  }, [user, loading, router, adminOnly])

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-4xl animate-spin mb-4">⟳</div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  
  if (!user) {
    return null
  }

  
  if (adminOnly && user.role !== "admin") {
    return null
  }

  return children
}

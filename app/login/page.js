"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, user, loading } = useAuth()

 
  useEffect(() => {
    if (user && !loading) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    const result = await login(email, password)

    if (!result.success) {
      setError(result.message || "Invalid email or password")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-green-500 text-4xl animate-spin mb-4">⟳</div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border-2 border-green-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">SproutCircle</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
             Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-600 hover:underline">
              Register
            </Link>
          </p>
        </div>

        
      </div>
    </div>
  )
}

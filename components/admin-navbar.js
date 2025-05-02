"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl">SproutCircle Admin</span>
          </Link>

          <div className="hidden md:flex space-x-4">
            <NavLink href="/admin/dashboard">Dashboard</NavLink>
            <NavLink href="/admin/students">Students</NavLink>
            <NavLink href="/admin/video-call">Video Call</NavLink>
            <NavLink href="/admin/gallery">Gallery</NavLink>
            <NavLink href="/admin/location">Location</NavLink>
            <NavLink href="/admin/timetable">Timetable</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 pb-4 px-4">
          <div className="flex flex-col space-y-2">
            <MobileNavLink href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/admin/students" onClick={() => setIsMenuOpen(false)}>
              Students
            </MobileNavLink>
            <MobileNavLink href="/admin/video-call" onClick={() => setIsMenuOpen(false)}>
              Video Call
            </MobileNavLink>
            <MobileNavLink href="/admin/gallery" onClick={() => setIsMenuOpen(false)}>
              Gallery
            </MobileNavLink>
            <MobileNavLink href="/admin/location" onClick={() => setIsMenuOpen(false)}>
              Location
            </MobileNavLink>
            <MobileNavLink href="/admin/timetable" onClick={() => setIsMenuOpen(false)}>
              Timetable
            </MobileNavLink>

            <div className="border-t border-gray-700 my-2 pt-2">
              {user && (
                <>
                  <div className="text-white px-3 py-2">Hello, {user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-white px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

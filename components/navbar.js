"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-green-500 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl">SproutCircle</span>
          </Link>

          <div className="hidden md:flex space-x-4">
            <NavLink href="/chat">Chat</NavLink>
            <NavLink href="/location">Location</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/video-call">Video Call</NavLink>
            <NavLink href="/timetable">Timetable</NavLink>
            <NavLink href="/games">Games</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-green-600 px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-white text-green-600 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                Login
              </Link>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-500 pb-4 px-4">
          <div className="flex flex-col space-y-2">
            <MobileNavLink href="/chat" onClick={() => setIsMenuOpen(false)}>
              Chat
            </MobileNavLink>
            <MobileNavLink href="/location" onClick={() => setIsMenuOpen(false)}>
              Location
            </MobileNavLink>
            <MobileNavLink href="/gallery" onClick={() => setIsMenuOpen(false)}>
              Gallery
            </MobileNavLink>
            <MobileNavLink href="/video-call" onClick={() => setIsMenuOpen(false)}>
              Video Call
            </MobileNavLink>
            <MobileNavLink href="/timetable" onClick={() => setIsMenuOpen(false)}>
              Timetable
            </MobileNavLink>
            <MobileNavLink href="/games" onClick={() => setIsMenuOpen(false)}>
              Games
            </MobileNavLink>

            <div className="border-t border-green-400 my-2 pt-2">
              {user ? (
                <>
                  <div className="text-white px-3 py-2">Hello, {user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-white px-3 py-2 rounded-md hover:bg-green-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <MobileNavLink href="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </MobileNavLink>
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
    <Link href={href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

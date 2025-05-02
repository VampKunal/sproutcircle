"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import AdminNavbar from "@/components/admin-navbar"

const SAMPLE_LOGINS = [
  { id: 1, username: "kartik", time: "2025-04-27 11:30:34", status: "success" },
  { id: 2, username: "arjun", time: "2025-04-27 10:30:34", status: "success" },
  { id: 3, username: "admin1", time: "2025-04-27 09:30:34", status: "failed" },
  { id: 4, username: "kunal_rai", time: "2025-04-27 08:30:34", status: "success" },
  { id: 5, username: "vampmassacre", time: "2025-04-27 07:30:34", status: "success" }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const studentCount = 5 // fixed based on your request

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to the SproutCircle admin dashboard.</p>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "overview" ? "border-b-2 border-green-500 text-green-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "logins" ? "border-b-2 border-green-500 text-green-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("logins")}
              >
                Login Activity
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <StatCard title="Total Students" value={studentCount} icon="👨‍🎓" color="bg-blue-100" />
              <StatCard title="Active Today" value={studentCount} icon="✅" color="bg-green-100" />
            </div>
          )}

          {activeTab === "logins" && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium text-gray-700">Recent Login Activity</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {SAMPLE_LOGINS.map((login) => (
                      <tr key={login.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">{login.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{login.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{login.time}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                              login.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {login.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full mr-4`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  )
}

"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/protected-route";
import AdminNavbar from "@/components/admin-navbar";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "" });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      const mapped = data.map((s) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role,
        createdAt: s.createdAt,
      }));
      setStudents(mapped);
    } catch (err) {
      setError("Could not load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    });

    if (res.ok) {
      await fetchStudents();
      setNewStudent({ name: "", email: "", password: "" });
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  const handleEditStudent = async () => {
    const res = await fetch(`/api/admin/students/${editingStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingStudent),
    });

    if (res.ok) {
      await fetchStudents();
      setEditingStudent(null);
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchStudents();
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Management</h1>
            <p className="text-gray-600">View and manage all students</p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search students..."
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="px-2 py-1 border rounded"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="px-2 py-1 border rounded"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="px-2 py-1 border rounded"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                />
                <button
                  onClick={handleAddStudent}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                >
                  Add
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-green-600">Loading students...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">{student.id}</td>
                        <td className="px-6 py-4 text-sm">{student.name}</td>
                        <td className="px-6 py-4 text-sm">{student.email}</td>
                        <td className="px-6 py-4 text-sm capitalize">{student.role}</td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(student.createdAt).toISOString().split("T")[0]}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => setEditingStudent(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Edit Modal */}
          {editingStudent && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit Student</h3>
                <input
                  className="w-full border px-2 py-1 mb-2 rounded"
                  value={editingStudent.name}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, name: e.target.value })
                  }
                />
                <input
                  className="w-full border px-2 py-1 mb-2 rounded"
                  value={editingStudent.email}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, email: e.target.value })
                  }
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => setEditingStudent(null)} className="text-gray-600">Cancel</button>
                  <button
                    onClick={handleEditStudent}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

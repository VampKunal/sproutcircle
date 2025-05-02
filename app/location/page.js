
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/auth-context";

export default function LocationPage() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLocation();
    }
  }, [user]);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    if (!user || !user.id) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/location?userId=${user.id}`);
      const data = await res.json();
      console.log("API Response:", data); 

      
      if (res.ok && data && data.data && data.data.name) {
        setLocation(data.data); 
      } else {
        setLocation(null);
        setError("No location found.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setError("An error occurred while fetching location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 p-4 text-center text-green-700 text-xl font-bold">
            📍 Where Am I Now?
          </div>
          <div className="p-6 flex flex-col items-center justify-center min-h-[40vh]">
            {loading ? (
              <div className="animate-spin text-4xl text-green-500 mb-4">⟳</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : location ? (
              <>
               
                <h2 className="text-3xl font-bold text-green-600 mb-2">{location.name || "Unknown Location"}</h2>
              </>
            ) : (
              <p className="text-lg">No location set yet.</p>
            )}
            <button
              onClick={fetchLocation}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

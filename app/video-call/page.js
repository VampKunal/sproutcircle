"use client"

import { useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"

export default function VideoCallPage() {
  const [callStatus, setCallStatus] = useState("idle")
  const [isVideoOff, setIsVideoOff] = useState(false)

  const teachers = [
    { id: 1, name: "Ms. Sumita", subject: "Main Teacher", avatar: "/example.svg" },
    { id: 2, name: "Mr. Arun", subject: "Art Teacher", avatar: "/example.svg" },
    { id: 3, name: "Ms. Eshita", subject: "Music Teacher", avatar: "/example.svg" },
  ]

  const startCall = (teacherId) => {
    setCallStatus("calling")
    setTimeout(() => {
      setCallStatus("connected")
    }, 2000)
  }
  const endCall = () => {
    setCallStatus("idle")
    setIsMuted(false)
    setIsVideoOff(false)
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 p-4">
            <h1 className="text-center text-green-700 text-xl font-bold">📱 Video Call My Teacher</h1>
          </div>
          <div className="p-6">
            {callStatus === "idle" ? (
              <div>
                <h2 className="text-xl font-bold text-center mb-6">Choose a teacher to call:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="border-2 border-green-200 rounded-lg p-4 text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 mt-4">
                        <Image
                          src={teacher.avatar}
                          alt={teacher.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <h3 className="font-bold text-lg">{teacher.name}</h3>
                      <p className="text-gray-500 mb-4">{teacher.subject}</p>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full"
                        onClick={() => startCall(teacher.id)}
                      >
                        Call
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : callStatus === "calling" ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 animate-pulse">
                  <Image
                    src={teachers[0].avatar}
                    alt={teachers[0].name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">Calling {teachers[0].name}...</h2>
                <p className="text-gray-500 mb-6">Please wait while we connect you</p>
                <button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16" onClick={endCall}>
                  📞
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="bg-gray-100 rounded-lg aspect-video mb-4 relative">
                  {isVideoOff ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-4xl">📵</span>
                    </div>
                  ) : (
                    <Image
                      src="/example.svg"
                      alt="Teacher video"
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  )}

                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-green-100 rounded-lg border-2 border-green-300 overflow-hidden">
                    {isVideoOff ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-2xl">📵</span>
                      </div>
                    ) : (
                      <Image
                        src="/example.svg"
                        alt="Your video"
                        width={128}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    className={`rounded-full w-12 h-12 ${isMuted ? "bg-red-100 border border-red-300" : "bg-gray-200"}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? "🔇" : "🎤"}
                  </button>

                  <button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16" onClick={endCall}>
                    📞
                  </button>

                  <button
                    className={`rounded-full w-12 h-12 ${isVideoOff ? "bg-red-100 border border-red-300" : "bg-gray-200"}`}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? "📵" : "📹"}
                  </button>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">{teachers[0].name}</h2>
                  <p className="text-gray-500">Connected</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

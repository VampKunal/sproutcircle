"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! I'm Sprouty, your friendly helper! How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { id: Date.now(), sender: "user", text: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      })

      if (!res.ok) throw new Error("Failed to fetch AI response.")
      const data = await res.json()

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.message || "Oops, I didn't understand that!",
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("AI error:", err)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: "bot", text: "⚠️ Error: Failed to fetch AI response." },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 p-4">
            <h1 className="text-center text-green-700 text-xl font-bold">🤖 Chat with Sprouty</h1>
          </div>
          <div className="h-[60vh] overflow-y-auto p-4 bg-green-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "bot" ? "bg-green-200" : "bg-blue-200"
                    }`}
                  >
                    {message.sender === "bot" ? "🌱" : "👧"}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-green-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

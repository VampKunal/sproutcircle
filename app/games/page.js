"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { useEffect } from "react"

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null)
  const games = [
    {
      id: "alphabet",
      title: "Alphabet Adventure",
      description: "Learn letters through a fun adventure!",
      icon: "🔤",
      color: "bg-blue-100 border-blue-300",
      level: "Easy",
      component: <AlphabetGame />,
    },
    {
      id: "counting",
      title: "Counting Stars",
      description: "Count the stars and learn numbers!",
      icon: "⭐",
      color: "bg-purple-100 border-purple-300",
      level: "Easy",
      component: <CountingGame />,
    },
    {
      id: "colors",
      title: "Color Match",
      description: "Match colors and learn their names!",
      icon: "🎨",
      color: "bg-pink-100 border-pink-300",
      level: "Medium",
      component: <ColorGame />,
    },
  ]

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 p-4">
            <h1 className="text-center text-green-700 text-xl font-bold">🎮 Fun Learning Games</h1>
          </div>
          <div className="p-6">
            {activeGame ? (
              <div>
                <button
                  className="mb-4 border border-green-200 rounded-md px-4 py-2 hover:bg-green-50"
                  onClick={() => setActiveGame(null)}
                >
                  ← Back to Games
                </button>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  {games.find((game) => game.id === activeGame).component}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className={`border-2 ${game.color} rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => setActiveGame(game.id)}
                  >
                    <div className="text-4xl mb-2">{game.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{game.level}</span>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
function AlphabetGame() {
  const [currentLetter, setCurrentLetter] = useState("A")
  const [score, setScore] = useState(0)

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const handleLetterClick = (letter) => {
    if (letter === currentLetter) {
      setScore(score + 1)
      const currentIndex = alphabet.indexOf(currentLetter)
      const nextIndex = (currentIndex + 1) % alphabet.length
      setCurrentLetter(alphabet[nextIndex])
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Alphabet Adventure</h2>
      <p className="mb-6">
        Find the letter: <span className="text-4xl font-bold text-green-600">{currentLetter}</span>
      </p>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {shuffle([...alphabet]).map((letter) => (
          <button
            key={letter}
            className="h-12 text-lg font-bold border-2 border-green-200 hover:bg-green-100 rounded-md"
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xl">
        <span className="text-yellow-500">🏆</span>
        <span>Score: {score}</span>
      </div>
    </div>
  )
}

function CountingGame() {
  const [count, setCount] = useState(5)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)

  const checkAnswer = () => {
    if (Number.parseInt(userAnswer) === count) {
      setFeedback("Correct! 🎉")
      setScore(score + 1)
      setCount(Math.floor(Math.random() * 10) + 1)
      setUserAnswer("")
    } else {
      setFeedback("Try again! 🤔")
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Counting Stars</h2>
      <p className="mb-6">How many stars do you see?</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-2xl">
            ⭐
          </span>
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-16 h-12 text-center text-xl font-bold border-2 border-green-300 rounded-md"
        />
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md" onClick={checkAnswer}>
          Check
        </button>
      </div>

      {feedback && (
        <p className={`text-lg font-medium ${feedback.includes("Correct") ? "text-green-600" : "text-orange-500"}`}>
          {feedback}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 text-xl mt-4">
        <span className="text-yellow-500">🏆</span>
        <span>Score: {score}</span>
      </div>
    </div>
  )
}

function ColorGame() {
  const colors = [
    { name: "Red", hex: "#ef4444" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Green", hex: "#22c55e" },
    { name: "Yellow", hex: "#eab308" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Orange", hex: "#f97316" },
  ]

  const [currentColor, setCurrentColor] = useState(colors[0])
  const [options, setOptions] = useState([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    generateQuestion()
  }, [])

  const generateQuestion = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setCurrentColor(randomColor)

    const newOptions = [randomColor]
    while (newOptions.length < 3) {
      const option = colors[Math.floor(Math.random() * colors.length)]
      if (!newOptions.includes(option)) {
        newOptions.push(option)
      }
    }

    setOptions(shuffle(newOptions))
    setFeedback("")
  }

  const handleColorSelect = (color) => {
    if (color.name === currentColor.name) {
      setFeedback("Correct! 🎉")
      setScore(score + 1)
      setTimeout(generateQuestion, 1000)
    } else {
      setFeedback("Try again! 🤔")
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Color Match</h2>
      <div className="w-32 h-32 mx-auto rounded-lg mb-6" style={{ backgroundColor: currentColor.hex }}></div>

      <p className="mb-4">What color is this?</p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {options.map((color) => (
          <button
            key={color.name}
            className="bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-100 px-4 py-2 rounded-md"
            onClick={() => handleColorSelect(color)}
          >
            {color.name}
          </button>
        ))}
      </div>

      {feedback && (
        <p className={`text-lg font-medium ${feedback.includes("Correct") ? "text-green-600" : "text-orange-500"}`}>
          {feedback}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 text-xl mt-4">
        <span className="text-yellow-500">🏆</span>
        <span>Score: {score}</span>
      </div>
    </div>
  )
}
function shuffle(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}


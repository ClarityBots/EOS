import React from 'react'
import Rocks from './modules/rocks/Rocks'

export default function App() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-orange">ClarityBotsPro</h1>
      <Rocks />
    </div>
  )
}

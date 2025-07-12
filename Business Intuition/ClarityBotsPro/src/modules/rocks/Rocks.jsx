import React, { useState } from 'react'
import ChatMessage from '../../components/ChatMessage'
import { fetchChatResponse } from '../../services/openaiService'
import { loadPersona } from '../../services/personaLoader'

export default function Rocks() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const persona = await loadPersona()
    const reply = await fetchChatResponse(newMessages, persona)

    setMessages([...newMessages, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white text-black rounded-lg p-4 space-y-2 min-h-[400px]">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
        {loading && <ChatMessage role="assistant" content="Thinking..." />}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-l-lg text-black"
          placeholder="Enter your SMART Rock..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-orange text-white px-6 py-2 rounded-r-lg font-bold"
        >
          Send
        </button>
      </div>
    </div>
  )
}

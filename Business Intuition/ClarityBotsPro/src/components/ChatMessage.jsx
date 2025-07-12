import React from 'react'

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user'
  return (
    <div
      className={`p-3 rounded-lg ${
        isUser ? 'bg-orange text-white self-end ml-auto' : 'bg-gray-100 text-black'
      }`}
    >
      <p>{content}</p>
    </div>
  )
}

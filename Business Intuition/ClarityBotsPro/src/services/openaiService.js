export async function fetchChatResponse(messages, persona) {
  const payload = {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: persona },
      ...messages
    ],
    temperature: 0.7
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || 'No response.'
}

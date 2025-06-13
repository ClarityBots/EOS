// gpt.js
import fetch from 'node-fetch';
import { prompts } from './promptConfig.js';

export async function handler(event, context) {
  try {
    const { tool = "rocks", userMessage } = JSON.parse(event.body || "{}");

    const systemPrompt = prompts[tool]?.system || "You are a helpful assistant.";

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI API error:", data);
      return {
        statusCode: openaiRes.status,
        body: JSON.stringify({ error: data }),
      };
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn’t get that.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong on the server." }),
    };
  }
}
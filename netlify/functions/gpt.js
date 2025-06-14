// netlify/functions/gpt.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, tool } = req.body;

    if (!message || !tool) {
      return res.status(400).json({ error: "Missing message or tool." });
    }

    const prompt = `You are a helpful EOS®-aligned assistant named ClarityBot. This is a user message from the ${tool} tool. Respond conversationally, clearly, and professionally:\n\nUser: ${message}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "No reply received.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("GPT Error:", err);
    return res.status(500).json({ error: "Something went wrong with the GPT function." });
  }
};
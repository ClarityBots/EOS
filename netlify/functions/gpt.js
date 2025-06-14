// netlify/functions/gpt.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (req, res) => {
  if (req.method !== "POST") {
    console.log("❌ Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, tool } = req.body;
    console.log("📥 Incoming message:", message);
    console.log("🛠 Tool selected:", tool);

    if (!message || !tool) {
      console.log("⚠️ Missing input");
      return res.status(400).json({ error: "Missing message or tool." });
    }

    const prompt = `You are a helpful EOS®-aligned assistant named ClarityBot. This is a user message from the ${tool} tool. Respond conversationally, clearly, and professionally:\n\nUser: ${message}`;
    console.log("🧠 Prompt to OpenAI:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "No reply received.";
    console.log("🤖 GPT Reply:", reply);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 GPT Function Error:", err);
    return res.status(500).json({ error: "Something went wrong with the GPT function." });
  }
};

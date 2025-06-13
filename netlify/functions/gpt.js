// /netlify/functions/gpt.js
import { Configuration, OpenAIApi } from "openai";
import { prompts } from "./promptConfig.js"; // Must be in same folder

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async (req, context) => {
  try {
    const { message, tool } = await req.json();
    const prompt = prompts[tool] || "You're an EOS® assistant. Help the user get started.";

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ reply: "❌ Missing OpenAI API key in environment settings." });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    return Response.json({ reply });

  } catch (err) {
    console.error("GPT error:", err);
    return Response.json({ reply: `🤖 Server error: ${err.message}` });
  }
};
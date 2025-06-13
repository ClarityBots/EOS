// /netlify/functions/gpt.js
import { Configuration, OpenAIApi } from "openai";
import { prompts } from "../../config/promptConfig.js"; // ✅ Updated import path

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async (req) => {
  try {
    const { message, tool } = await req.json();
    const prompt = prompts[tool] || "You're an EOS® assistant. Help the user get started.";

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ reply: "❌ Missing OpenAI API key." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.data.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("GPT error:", err);

    return new Response(
      JSON.stringify({
        reply: `🤖 Server error: ${err.message}`,
        stack: err.stack, // Optional: remove after debug
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Say hello like you're ClarityBot." }],
    });
    console.log("✅ GPT Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("❌ GPT Call Failed:", err);
  }
}

test();
// /netlify/functions/gpt.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler() {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say something wise about EOS Rocks." },
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
      JSON.stringify({ reply: `🤖 GPT error: ${err.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
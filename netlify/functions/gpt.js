const OpenAI = require("openai");
const { prompts } = require("./promptConfig.js"); // ← Imports the prompt library

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');

    if (!prompt || prompt.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    // 🚀 Step 1: Set your active tool here (will make dynamic later)
    const tool = "smartRock";
    const systemPrompt = prompts[tool].system;

    // 🚀 Step 2: Call OpenAI with both system + user messages
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: reply || "🤖 GPT responded, but returned nothing.",
      }),
    };
  } catch (error) {
    console.error("💥 GPT ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        answer: `🤖 GPT Error: ${error?.response?.data?.error?.message || error.message}`,
      }),
    };
  }
};
const OpenAI = require("openai");

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Or "gpt-3.5-turbo" if needed
      messages: [{ role: "user", content: prompt }],
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
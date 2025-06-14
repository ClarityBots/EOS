// netlify/functions/gpt.js

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const { message, tool } = body;

    const systemPrompts = {
      smart_rocks: "You are a SMART Rock Builder...",
      scorecard: "You are a Scorecard Coach...",
      core_values: "You are a Core Values Coach...",
      people_analyzer: "You are a People Analyzer Assistant...",
      vision_builder: "You are a Vision Builder Bot..."
    };

    const system = systemPrompts[tool] || "You are a helpful EOS®-aligned assistant.";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message }
      ]
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response.";
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("GPT Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Server error: " + error.message })
    };
  }
};
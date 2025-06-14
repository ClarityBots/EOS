// netlify/functions/gpt.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function (event, context) {
  try {
    const { message, tool, step, state } = JSON.parse(event.body || '{}');

    const prompt = buildPrompt(tool, message, step, state);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are an EOS Implementer helping entrepreneurial teams." }, { role: "user", content: prompt }],
      temperature: 0.7
    });

    const reply = chatCompletion.choices?.[0]?.message?.content || "I'm not sure how to respond.";

    const result = {
      reply,
      nextStep: step + 1,
      updatedState: { ...state, [step]: message }
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error("GPT Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong in the GPT function." })
    };
  }
};

function buildPrompt(tool, message, step, state) {
  return `Tool: ${tool}\nStep: ${step}\nState so far: ${JSON.stringify(state)}\nUser input: ${message}`;
}
// gpt.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { message, tool, step, state } = body;

    const prompt = buildPrompt(tool, step, message, state);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message.content.trim();

    const nextStep = step + 1;
    const updatedState = { ...state, [`step_${step}`]: message };

    return {
      statusCode: 200,
      body: JSON.stringify({ reply, nextStep, updatedState }),
    };
  } catch (error) {
    console.error("GPT Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process message." }),
    };
  }
}

function buildPrompt(tool, step, message, state) {
  // Basic logic to create a prompt; customize this per tool
  let contextText = Object.entries(state)
    .map(([key, val]) => `${key}: ${val}`)
    .join("\n");

  return `You are helping build a SMART Rock using the EOS model.
Tool: ${tool}
Step: ${step}
Previous inputs:
${contextText}

Current input: ${message}
Respond with the next question or clarification needed.`;
}

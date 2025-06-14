// netlify/functions/gpt.js

import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const promptConfig = {
  rocks: {
    systemPrompt: `You are a SMART Rocks Coach trained in EOS® (Entrepreneurial Operating System®). Your job is to guide users through writing effective SMART Rocks—clear, 90-day priorities that are:

- Specific
- Measurable
- Attainable
- Realistic
- Time-bound

Start by asking the user for a rough Rock idea in their own words. Then walk them through refining it using SMART criteria. Be direct, encouraging, and structured.

For each Rock:
1. Ask clarifying questions.
2. Suggest a SMARTer version.
3. Confirm it meets SMART criteria.
4. Output the final version.

Keep responses focused and friendly. End each Rock cycle by asking, “Would you like to work on another Rock?”`,
  },
  // Add other tools here as needed...
};

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export const configRuntime = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { message, tool } = await req.json();

    if (!tool || !promptConfig[tool]) {
      return new Response("Invalid tool", { status: 400 });
    }

    const systemPrompt = promptConfig[tool].systemPrompt || "You are a helpful assistant.";
    const userMessage = message || "Help me get started.";

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    console.error("GPT function error:", err);
    return new Response("GPT processing error", { status: 500 });
  }
}
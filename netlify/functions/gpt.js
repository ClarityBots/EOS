// gpt.js

import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { promptConfig } from "../../promptConfig.js";

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
// netlify/functions/gpt.js

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Set in Netlify environment settings
});

const openai = new OpenAIApi(configuration);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt || prompt.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4", // or "gpt-3.5-turbo" for cheaper/faster results
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("OpenAI error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
};
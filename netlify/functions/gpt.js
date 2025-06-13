// /netlify/functions/gpt.js
import { Configuration, OpenAIApi } from "openai-edge";
import { prompts } from "../../promptConfig.js";

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export default async (req, context) => {
  try {
    const { message, tool } = await req.json();
    const prompt = prompts[tool] || "You're an EOS® assistant.";

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
    });

    const reply = await response.json();
    return Response.json({ reply: reply.choices[0].message.content });
  } catch (err) {
    return Response.json({ reply: "Sorry, something went wrong on the server." });
  }
};
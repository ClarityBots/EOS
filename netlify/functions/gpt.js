// /netlify/functions/gpt.js
import { Configuration, OpenAIApi } from "openai-edge";
import { prompts } from "./promptConfig.js"; // Must be in same folder

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async (req, context) => {
  try {
    const { message, tool } = await req.json();
    const prompt = prompts[tool] || "You're an EOS® assistant. Help the user get started.";

    if (!config.apiKey) {
      return Response.json({ reply: "❌ Missing OpenAI API key. Please check your environment settings." });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return Response.json({ reply: "🤖 GPT returned an unexpected response. Please try again." });
    }

    return Response.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("GPT error:", err);
    return Response.json({ reply: `🤖 Server error: ${err.message}` });
  }

  } catch (err) {
    console.error("GPT error:", err); // For Netlify logs
    return Response.json({ reply: `🤖 Server error: ${err.message}` }); // Show this in chat
  }
};
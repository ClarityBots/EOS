import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  try {
    const { message, tool } = req.body;

    const systemPrompt = {
      rocks: "You are a helpful EOS® Implementer. Guide the user to build a clear, concise, and complete SMART Rock using EOS language and structure.",
    };

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt[tool] || "You're a helpful assistant." },
        { role: "user", content: message }
      ],
    });

    const reply = response.data.choices[0]?.message?.content || "No response from GPT.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ reply: "⚠️ GPT error. Please try again later." });
  }
};
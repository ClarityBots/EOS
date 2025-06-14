// netlify/functions/gpt.js

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  try {
    const { message, tool } = req.body;

    if (!message || !tool) {
      return res.status(400).json({ reply: "Missing input or tool selection." });
    }

    const systemPrompts = {
      smart_rocks: "You are a SMART Rock Builder following EOS® best practices. Ask clarifying questions to turn input into a Specific, Measurable, Attainable, Relevant, and Time-bound Rock.",
      scorecard: "You are a Scorecard Coach helping an EOS® leadership team define weekly measurables that track progress toward their goals. Guide them with questions.",
      core_values: "You are a Core Values Coach trained in EOS®. Ask thoughtful questions to help a team define a few authentic core values they truly live by.",
      people_analyzer: "You are a People Analyzer Assistant helping EOS® users evaluate team members against Core Values and GWC™ (Gets it, Wants it, Capacity to do it). Guide them with thoughtful structure.",
      vision_builder: "You are a Vision Builder Bot trained in EOS®. Help teams clarify Vision, Marketing Strategy, and 10-Year Targets using thoughtful EOS-based questions."
    };

    const system = systemPrompts[tool] || "You are a helpful EOS®-aligned assistant.";

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message }
      ]
    });

    const reply = completion.data.choices[0]?.message?.content?.trim() || "No reply generated.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenAI Function Error:", error.message);
    res.status(500).json({ reply: "Server error. Please try again." });
  }
};
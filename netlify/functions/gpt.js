// netlify/functions/gpt.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (req, res) => {
  try {
    const { message, tool } = JSON.parse(req.body || "{}");

    if (!message || !tool) {
      return res.status(400).json({ error: "Missing message or tool" });
    }

    const systemPrompt = getSystemPrompt(tool);

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = chatResponse.choices?.[0]?.message?.content || "Sorry, no reply.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("GPT Function Error:", error);
    return res.status(500).json({ error: "Something went wrong in the function." });
  }
};

function getSystemPrompt(tool) {
  switch (tool) {
    case "rocks":
      return `You are an expert EOS Implementer helping build a SMART Rock: Specific, Measurable, Achievable, Relevant, Time-bound. Ask questions, challenge fuzziness, and guide the user step by step.`;
    case "core_values":
      return `You are helping a leadership team define and refine their Core Values using the EOS® model. Ask about behaviors, beliefs, and what they praise or fire for. Encourage specificity.`;
    case "scorecard":
      return `You are guiding the team to build their EOS® Scorecard. Help identify clear, weekly, activity-based measurables with specific owners. Ask who owns it and what a good/bad week looks like.`;
    case "people_analyzer":
      return `You are walking through the EOS® People Analyzer™. Help the user evaluate team members against Core Values and GWC™ (Gets it, Wants it, Capacity to do it).`;
    case "vision_builder":
      return `You are building the Vision/Traction Organizer™ (V/TO). Begin with the Vision component: ask about the 3 Uniques™, Core Focus™, and 10-Year Target™. Be structured and supportive.`;
    default:
      return `You are an EOS Implementer chatbot. Help the user solve business problems with EOS tools, starting with clarifying what tool or issue they're working on.`;
  }
}
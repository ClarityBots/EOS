// netlify/functions/gpt.js

import { OpenAI } from "openai";

const openai = new OpenAI();

export default async (req, res) => {
  try {
    const { messages, systemPrompt, tool, step } = JSON.parse(req.body || "{}");

    let enrichedMessages = [];

    if (systemPrompt) {
      enrichedMessages.push({ role: "system", content: systemPrompt });
    }

    if (messages && messages.length > 0) {
      enrichedMessages = enrichedMessages.concat(messages);
    }

    // If this is a SMART Rocks session and a step is defined, add it to the system context
    if (tool === "rocks" && step) {
      enrichedMessages.push({
        role: "system",
        content: `You are currently guiding the user through the \"${step}\" part of the SMART Rock process. Respond accordingly with helpful guidance and examples.`
      });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: enrichedMessages,
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ error: "GPT request failed." });
  }
};

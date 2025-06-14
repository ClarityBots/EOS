// netlify/functions/gpt.js

import { OpenAI } from "openai";

const openai = new OpenAI();

export default async (req, res) => {
  try {
    const { messages, systemPrompt, tool, step } = JSON.parse(req.body || "{}");

    let enrichedMessages = [];

    // Add system prompt
    if (systemPrompt) {
      enrichedMessages.push({ role: "system", content: systemPrompt });
    }

    // Add message history
    if (messages && messages.length > 0) {
      enrichedMessages = enrichedMessages.concat(messages);
    }

    // Tool + Step awareness (Phase 2 logic)
    if (tool && step) {
      const stepMessage = {
        rocks: `You're helping define the "${step}" part of a SMART Rock. Be clear, helpful, and EOS-aligned.`,
        vision: `You're guiding the team through the "${step}" part of the Vision Builder™. Respond with EOS® best practices.`,
        people: `You're helping the team analyze someone using the People Analyzer™. The current focus is "${step}".`,
        vto: `You're walking through the "${step}" section of the V/TO™ (Vision/Traction Organizer). Help them get clear.`,
        lma: `You're coaching someone to better Lead + Manage + hold Accountable (LMA™). Focus on "${step}".`,
        quarterly: `You're preparing a team for a Quarterly Session. Focus now on "${step}" planning priorities.`
      };

      if (stepMessage[tool]) {
        enrichedMessages.push({
          role: "system",
          content: stepMessage[tool]
        });
      }
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
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
// netlify/functions/gpt.js

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler = async (event) => {
  try {
    const { message, tool, step, state } = JSON.parse(event.body);

    const tools = {
      rocks: "You're a SMART Rock™ Coach helping users clarify their quarterly priorities using EOS®. Guide them step by step.",
      scorecard: "You're a Scorecard Coach guiding EOS® users to define and track weekly activity-based metrics.",
      coreValues: "You're a Core Values Coach helping EOS® users define their company's essential Core Values.",
      vision: "You're a Vision Coach guiding EOS® users to clarify their long-term vision using the V/TO™.",
      lma: "You're an LMA™ Coach helping leaders improve how they Lead and Manage Accountably."
    };

    const systemPrompt = tools[tool] || "You're a helpful business coach.";

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo"
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I didn't get that.";

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply,
        nextStep: step + 1,
        updatedState: state
      })
    };
  } catch (err) {
    console.error("GPT Function Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function failed to respond properly." })
    };
  }
};
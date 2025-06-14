import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log("📥 Incoming request to /gpt:", req.body);

    const { messages, systemPrompt, tool, step } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: "Invalid input: 'messages' is required." });
    }

    const fullMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // ✅ Updated to use GPT-4o
      messages: fullMessages,
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error("⚠️ GPT response was empty.");
      return res.status(500).json({ reply: "Sorry, no response from GPT." });
    }

    console.log("✅ GPT reply:", reply);

    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ GPT function error:", error);
    res.status(500).json({ reply: "Sorry, something went wrong with the GPT function." });
  }
};
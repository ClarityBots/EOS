import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  try {
    console.log("🟡 gpt.js function running...");

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Missing OpenAI API Key");
      return res.status(500).json({ reply: "Missing OpenAI key." });
    }

    const { messages, systemPrompt, tool, step } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Invalid or missing messages");
      return res.status(400).json({ reply: "Invalid input format." });
    }

    const fullMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages,
    ];

    console.log("📨 Calling GPT with messages:", fullMessages);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error("⚠️ GPT returned empty content");
      return res.status(500).json({ reply: "No reply from GPT." });
    }

    console.log("✅ GPT replied:", reply);
    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ GPT Error:", err);
    res.status(500).json({ reply: "GPT function failed." });
  }
};
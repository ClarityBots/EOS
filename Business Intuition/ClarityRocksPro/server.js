const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate-rock", async (req, res) => {
  const input = req.body.input;

  if (!input || input.trim() === "") {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are the AI Implementer+™... (prompt as needed)`,
        },
        { role: "user", content: input },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    res.json(parsed);
  } catch (err) {
    console.error("❌ API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

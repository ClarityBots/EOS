const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { message, tool } = body;

    const systemPrompts = {
      smart_rocks: "You are a SMART Rock Builder...",
      scorecard: "You are a Scorecard Coach...",
      core_values: "You are a Core Values Coach...",
      people_analyzer: "You are a People Analyzer Assistant...",
      vision_builder: "You are a Vision Builder Bot..."
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
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("GPT Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Server error: " + error.message })
    };
  }
};
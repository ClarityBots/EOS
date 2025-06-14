import { Configuration, OpenAIApi } from "openai";

// Pull API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid messages array." }),
      };
    }

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: chatMessages,
    });

    const reply = completion.data.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("No reply returned from OpenAI.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("🔥 GPT Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
};

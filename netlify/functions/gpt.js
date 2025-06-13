// /netlify/functions/gpt.js

export default async function handler(req) {
  try {
    const { message, tool } = await req.json();

    const toolPrompts = {
      rocks: "You are an EOS® Implementer helping a team craft SMART Rocks.",
      scorecard: "You are an EOS® coach helping define measurables and a Scorecard.",
      ids: "You are an EOS® facilitator guiding an IDS (Identify–Discuss–Solve) session.",
      corevalues: "You help EOS® teams clarify and apply their Core Values.",
      available: "You're a friendly AI helping users get to know ClarityBots™ tools.",
    };

    const prompt = toolPrompts[tool] || "You are a helpful EOS® assistant.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "🤖 GPT returned an empty response.";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("GPT error:", err);
    return new Response(
      JSON.stringify({
        reply: `🤖 GPT error: ${err.message}`,
        stack: err.stack,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
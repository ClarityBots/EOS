// /netlify/functions/gpt.js

export default async function handler() {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful EOS® assistant." },
          { role: "user", content: "Say something wise about EOS Rocks." },
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
      JSON.stringify({ reply: `🤖 GPT error: ${err.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
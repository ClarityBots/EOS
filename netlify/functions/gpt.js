export default async function handler() {
  return new Response(
    JSON.stringify({
      reply: "✅ ClarityBot is working. GPT not wired in yet, but the engine is running.",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
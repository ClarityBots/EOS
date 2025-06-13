// /netlify/functions/gpt.js
export default async (req, context) => {
  try {
    const { message, tool } = await req.json();
    return Response.json({
      reply: `✅ Test successful. You chose tool "${tool}" and said: "${message}"`,
    });
  } catch (err) {
    console.error("Test error:", err);
    return Response.json({ reply: `❌ Server error: ${err.message}` });
  }
};
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const { message: messages } = JSON.parse(event.body);
  const apiKey = process.env.OPENAI_API_KEY;

  // Branded fallback messages
  const toolFallbacks = {
    ids: "⚠️ IDS ClarityBot™ is temporarily unavailable. Your Issues deserve attention — please try again shortly.",
    rocks: "⚠️ SMART Rocks ClarityBot™ isn’t responding right now. You’ll be crushing 90-day goals again in no time — hang tight.",
    scorecard: "⚠️ Scorecard ClarityBot™ hit a snag. Measurables are important — give it another try soon.",
    core: "⚠️ Core Values ClarityBot™ is paused. Your culture matters — refresh or try again later.",
    traction: "⚠️ Traction™ Bot is momentarily offline. Vision without Traction is hallucination — we’ll be back shortly.",
    author: "⚠️ The ClarityBots® creator is out aligning rocks. Try again soon for insight on the mission behind the bots.",
    default: "⚠️ ClarityBots® is temporarily offline. Please refresh or return shortly — we’re on it!"
  };

  // Try to match fallback to system prompt keyword
  const toolKey = Object.keys(toolFallbacks).find(key =>
    messages[0].content.toLowerCase().includes(key)
  );

  // Log incoming messages for diagnostics
  console.log("🔍 Incoming GPT messages:", messages);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("✅ OpenAI response received");

    const reply = data.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: reply || toolFallbacks[toolKey] || toolFallbacks.default
      })
    };

  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: toolFallbacks[toolKey] || toolFallbacks.default,
        error: error.message
      })
    };
  }
};
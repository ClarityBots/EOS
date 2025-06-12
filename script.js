async function sendToOpenAI() {
  const userInput = document.getElementById('userInput').value;
  const responseArea = document.getElementById('responseArea');
  const clearBtn = document.getElementById('clearButton');
  const selectedTool = document.getElementById('toolSelect').value;

  const toolPrompts = {
    ids: "You are an EOS Implementer helping a team go through the IDS process.",
    rocks: "You are guiding a leadership team to create clear and SMART 90-day Rocks.",
    scorecard: "You are an EOS coach helping design a weekly scorecard with measurable numbers.",
    core: "You are helping an EOS company uncover and clarify their Core Values.",
    traction: "You are summarizing tools and teachings from the book Traction by Gino Wickman.",
    author: "You are introducing yourself as the creator of ClarityBots, sharing its vision and purpose."
  };

  const messages = [
    { role: "system", content: toolPrompts[selectedTool] || "You are a helpful EOS advisor." },
    { role: "user", content: userInput }
  ];

  responseArea.innerText = "Thinking...";
  clearBtn.disabled = true;

  try {
    const res = await fetch("/.netlify/functions/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: messages })
    });

    const data = await res.json();
    clearBtn.disabled = false;

    if (data.reply) {
      responseArea.innerText = data.reply;
    } else if (data.error) {
      responseArea.innerText = "OpenAI Error: " + data.error;
    } else {
      responseArea.innerText = "Unexpected response from server.";
    }
  } catch (err) {
    clearBtn.disabled = false;
    responseArea.innerText = "Network Error: " + err.message;
  }
}

function clearChat() {
  document.getElementById('userInput').value = "";
  document.getElementById('responseArea').innerText = "";
}

function updateToolInfo() {
  const selected = document.getElementById("toolSelect").value;
  const toolInfo = document.getElementById("toolInfo");

  const tools = {
    ids: {
      title: "IDS ClarityBot™",
      desc: "Identify, Discuss, and Solve team issues using EOS® best practices."
    },
    rocks: {
      title: "SMART Rocks ClarityBot™",
      desc: "Build meaningful 90-day goals using the SMART Rock framework."
    },
    scorecard: {
      title: "Scorecard ClarityBot™",
      desc: "Design measurable weekly numbers for accountability and traction."
    },
    core: {
      title: "Core Values ClarityBot™",
      desc: "Uncover and clarify your company's Core Values through guided prompts."
    },
    traction: {
      title: "Traction™ by Gino Wickman",
      desc: "Explore tools and teachings from the book *Traction™* by Gino Wickman."
    },
    author: {
      title: "Meet the ClarityBots® Creator",
      desc: "Get to know the creator of ClarityBots and how it all came together."
    }
  };

  const selectedTool = tools[selected];
  toolInfo.innerHTML = `<h3>${selectedTool.title}</h3><p>${selectedTool.desc}</p>`;
}
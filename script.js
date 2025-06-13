import { clients } from './clientConfig.js';

let selectedTool = null;
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Load client branding
const urlParams = new URLSearchParams(window.location.search);
const clientKey = urlParams.get("client") || "business_intuition";
const client = clients[clientKey];

document.getElementById("clientLogo").src = client.logo;
document.getElementById("clientLogo").alt = client.altText;
document.getElementById("mainHeading").innerText = `${client.heading} ClarityBot™`;
document.body.style.backgroundColor = client.brandColor + "10";

// Tool selection
document.querySelectorAll(".tool-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTool = btn.dataset.tool;
    appendBotMessage(`🛠 You selected: ${btn.innerText}. Go ahead and ask your first question.`);
  });
});

// Send message
sendBtn.addEventListener("click", async () => {
  const userText = userInput.value.trim();
  if (!userText || !selectedTool) return;

  appendUserMessage(userText);
  userInput.value = "";
  appendBotMessage("🤖 Thinking...");

  try {
    const res = await fetch("/.netlify/functions/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, tool: selectedTool }),
    });

    const data = await res.json();
    const lastBot = document.querySelector("#chatWindow div:last-child");
    lastBot.innerHTML = `🤖 ${data.reply || "Sorry, something went wrong."}`;
  } catch (err) {
    appendBotMessage("🤖 Error reaching GPT.");
  }
});

// Chat display helpers
function appendUserMessage(text) {
  const div = document.createElement("div");
  div.className = "text-right mb-2";
  div.innerHTML = `<span class="inline-block bg-blue-100 p-2 rounded">${text}</span>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendBotMessage(text) {
  const div = document.createElement("div");
  div.className = "text-left mb-2";
  div.innerHTML = `<span class="inline-block bg-gray-100 p-2 rounded">${text}</span>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
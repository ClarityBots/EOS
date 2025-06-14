import prompts from './promptConfig.js';

let currentStep = 0;
let currentTool = '';
let messages = [];

function addMessage(text, isUser = false) {
  const chat = document.getElementById("chat");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble p-3 rounded-xl ${isUser ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`;
  bubble.textContent = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function showLoader(show = true) {
  document.getElementById("loader").classList.toggle("hidden", !show);
}

function resetChat() {
  document.getElementById("chat").innerHTML = '';
  currentStep = 0;
  currentTool = '';
  messages = [];
}

function sendPrompt() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  messages.push({ role: "user", content: text });
  input.value = '';
  showLoader(true);

  fetch('/.netlify/functions/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: currentTool, messages })
  })
    .then(res => res.json())
    .then(data => {
      const reply = data.reply || "🤖 Sorry, something went wrong.";
      addMessage(reply);
      messages.push({ role: "assistant", content: reply });
      showLoader(false);
    })
    .catch(err => {
      console.error("GPT Error:", err);
      addMessage("🤖 Sorry, something went wrong.");
      showLoader(false);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tool-button");
  const sendBtn = document.getElementById("sendButton");
  const resetBtn = document.getElementById("resetButton");

  sendBtn.addEventListener("click", sendPrompt);
  resetBtn.addEventListener("click", resetChat);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      currentTool = button.getAttribute("data-tool");
      currentStep = 0;
      messages = [{ role: "system", content: `You are ClarityBot, helping with ${currentTool}` }];
      resetChat();
      addMessage(prompts[currentTool][currentStep++] || "Let's get started.");
    });
  });
});
// script.js
import prompts from './promptConfig.js';

const toolContainer = document.getElementById("toolContainer");
const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const resetButton = document.getElementById("resetButton");
const loader = document.getElementById("loader");

let currentTool = null;

function addMessage(content, sender = "user") {
  const messageEl = document.createElement("div");
  messageEl.className = `chat-bubble p-3 rounded-lg shadow-md w-fit max-w-[90%] ${
    sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
  }`;
  messageEl.innerText = content;
  chat.appendChild(messageEl);
  chat.scrollTop = chat.scrollHeight;
}

function clearChat() {
  chat.innerHTML = "";
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input || !currentTool) return;
  addMessage(input, "user");
  userInput.value = "";
  showLoader();

  try {
    const response = await fetch("/.netlify/functions/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, tool: currentTool })
    });

    const data = await response.json();
    addMessage(data.reply || "Sorry, something went wrong.", "bot");
  } catch (error) {
    console.error("GPT Error:", error);
    addMessage("Something went wrong while getting a response.", "bot");
  } finally {
    hideLoader();
  }
}

function setupToolButtons() {
  toolContainer.innerHTML = "";
  Object.keys(prompts).forEach((toolKey) => {
    const button = document.createElement("button");
    button.innerText = prompts[toolKey].label || toolKey;
    button.className = "px-4 py-2 rounded-lg shadow bg-white hover:bg-gray-100 border text-gray-800 font-semibold text-left";
    button.onclick = () => {
      currentTool = toolKey;
      clearChat();
      addMessage(prompts[toolKey].initialPrompt, "bot");
    };
    toolContainer.appendChild(button);
  });
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

resetButton.addEventListener("click", () => {
  userInput.value = "";
  clearChat();
});

window.onload = () => {
  setupToolButtons();
};
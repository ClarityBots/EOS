import prompts from './promptConfig.js';

const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const resetButton = document.getElementById("resetButton");
const loader = document.getElementById("loader");
let selectedTool = null;

const toolButtons = document.querySelectorAll(".tool-button");
toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTool = button.getAttribute("data-tool");
    chat.innerHTML = "";
    appendMessage("🤖", prompts[selectedTool]?.[0] || "How can I help?");
  });
});

sendButton.addEventListener("click", sendMessage);
resetButton.addEventListener("click", () => {
  chat.innerHTML = "";
  userInput.value = "";
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input || !selectedTool) return;

  appendMessage("🧑‍💼", input);
  userInput.value = "";
  loader.classList.remove("hidden");

  const messages = Array.from(chat.children).map((node) => {
    const role = node.querySelector("strong").textContent.includes("🤖")
      ? "assistant"
      : "user";
    const content = node.textContent.replace(/^🤖 |^🧑‍💼 /, "");
    return { role, content };
  });

  try {
    const response = await fetch("/.netlify/functions/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        systemPrompt: prompts[selectedTool]?.[0] || "You are a helpful assistant."
      }),
    });

    const data = await response.json();
    appendMessage("🤖", data.reply || "(No response received)");
  } catch (error) {
    console.error("Error:", error);
    appendMessage("🤖", "Sorry, something went wrong.");
  } finally {
    loader.classList.add("hidden");
  }
}

function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble bg-gray-100 rounded-xl p-3 shadow-sm";
  bubble.innerHTML = `<strong>${sender}</strong> ${text}`;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

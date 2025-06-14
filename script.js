import { prompts } from "./promptConfig.js";

console.log("✅ script.js loaded");

let selectedTool = null;
let conversation = [];

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const resetButton = document.getElementById("resetButton");
const loader = document.getElementById("loader");
const toolButtons = document.querySelectorAll(".tool-button");

toolButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTool = btn.getAttribute("data-tool");
    conversation = [];

    const prompt = prompts[selectedTool];
    if (prompt) {
      conversation.push({ role: "assistant", content: prompt.starter });
      renderConversation();
    }
  });
});

sendButton.addEventListener("click", sendMessage);
resetButton.addEventListener("click", resetConversation);

function renderConversation() {
  chat.innerHTML = "";
  conversation.forEach((msg) => {
    addMessage(msg.role === "user" ? "🧑‍💼" : "🤖", msg.content);
  });
}

function addMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = `<strong>${sender}</strong><br>${text}`;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const inputText = input.value.trim();
  if (!inputText || !selectedTool) return;

  conversation.push({ role: "user", content: inputText });
  renderConversation();
  input.value = "";
  loader.classList.remove("hidden");

  try {
    const payload = {
      messages: conversation,
      systemPrompt: prompts[selectedTool].system,
      tool: selectedTool,
      step: null,
    };

    const response = await fetch("/.netlify/functions/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GPT call failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();

    if (!data.reply || typeof data.reply !== "string") {
      throw new Error("GPT returned an invalid or empty reply.");
    }

    conversation.push({ role: "assistant", content: data.reply });
  } catch (err) {
    console.error("GPT error:", err);
    conversation.push({
      role: "assistant",
      content: `🤖 Sorry! GPT call failed.\n${err.message}`,
    });
  } finally {
    loader.classList.add("hidden");
    renderConversation();
  }
}

function resetConversation() {
  conversation = [];
  chat.innerHTML = "";
  input.value = "";
}
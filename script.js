// script.js

import { promptConfig } from './promptConfig.js';

let currentTool = null;
let stepIndex = 0;
let conversationHistory = [];
let toolMemory = {}; // Tracks step for each tool

document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const resetButton = document.getElementById('resetButton');
  const userInput = document.getElementById('userInput');
  const chat = document.getElementById('chat');
  const loader = document.getElementById('loader');

  document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', () => {
      currentTool = button.getAttribute('data-tool');
      stepIndex = 0;
      conversationHistory = [];
      chat.innerHTML = "";
      userInput.value = "";
      toolMemory[currentTool] = { step: null };

      const config = promptConfig[currentTool];
      if (!config) return;

      const starter = config.starterPrompt;
      addMessage("user", starter);
      showLoader();
      fetchGPT(starter, config.systemPrompt, null);
    });
  });

  sendButton.addEventListener('click', () => {
    const msg = userInput.value.trim();
    if (msg === "") return;

    addMessage("user", msg);
    userInput.value = "";
    showLoader();

    const config = promptConfig[currentTool];
    const systemPrompt = config?.systemPrompt || "";
    const step = toolMemory[currentTool]?.step || null;

    fetchGPT(msg, systemPrompt, step);
  });

  resetButton.addEventListener('click', () => {
    chat.innerHTML = "";
    userInput.value = "";
    conversationHistory = [];
    stepIndex = 0;
    toolMemory[currentTool] = { step: null };
  });

  function showLoader() {
    loader.classList.remove("hidden");
  }

  function hideLoader() {
    loader.classList.add("hidden");
  }

  function addMessage(role, content) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble p-3 rounded-xl max-w-xl ${
      role === "user" ? "bg-blue-100 self-end text-right" : "bg-gray-100 self-start text-left"
    }`;
    bubble.textContent = content;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function fetchGPT(userMsg, systemPrompt, currentStep) {
    conversationHistory.push({ role: "user", content: userMsg });

    fetch("/.netlify/functions/gpt", {
      method: "POST",
      body: JSON.stringify({
        messages: conversationHistory,
        systemPrompt,
        tool: currentTool,
        step: currentStep,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const reply = data.reply?.trim() || "🤖 Sorry, I didn’t understand that.";
        conversationHistory.push({ role: "assistant", content: reply });
        addMessage("assistant", reply);
        hideLoader();

        // Step advancement
        const config = promptConfig[currentTool];
        const steps = config?.steps;

        if (steps && stepIndex < steps.length) {
          const nextStep = steps[stepIndex];
          toolMemory[currentTool] = { step: nextStep.id };

          setTimeout(() => {
            addMessage("assistant", nextStep.prompt);
          }, 800);

          stepIndex++;
        }
      })
      .catch((err) => {
        console.error("GPT Error:", err);
        hideLoader();
        addMessage("assistant", "🤖 Something went wrong. Please try again.");
      });
  }
});
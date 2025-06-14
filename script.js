// script.js

import { promptConfig } from './promptConfig.js';

let currentTool = null;
let currentStep = 0;
let messageHistory = [];

const chatContainer = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const resetButton = document.getElementById('resetButton');
const loader = document.getElementById('loader');
const toolButtons = document.querySelectorAll('.tool-button');

function appendMessage(role, content) {
  if (!chatContainer) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble p-3 rounded-lg shadow text-sm whitespace-pre-wrap ${role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`;
  bubble.textContent = content;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function resetChat() {
  if (chatContainer) chatContainer.innerHTML = '';
  if (userInput) userInput.value = '';
  if (loader) loader.classList.add('hidden');
  messageHistory = [];
  currentStep = 0;
}

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  appendMessage('user', msg);
  if (loader) loader.classList.remove('hidden');

  messageHistory.push({ role: 'user', content: msg });

  try {
    const config = promptConfig[currentTool] || {};
    const systemPrompt = config.systemPrompt || '';
    const response = await fetch('/.netlify/functions/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messageHistory,
        systemPrompt,
        tool: currentTool,
        step: config.steps?.[currentStep]?.id || null
      })
    });

    const data = await response.json();
    const reply = data.reply || "Sorry, something went wrong.";

    appendMessage('assistant', reply);
    messageHistory.push({ role: 'assistant', content: reply });
    if (loader) loader.classList.add('hidden');

    // advance step if using step flow
    if (config.steps && currentStep < config.steps.length - 1) {
      currentStep++;
      const nextPrompt = config.steps[currentStep].prompt;
      appendMessage('assistant', nextPrompt);
      messageHistory.push({ role: 'assistant', content: nextPrompt });
    }
  } catch (err) {
    console.error("GPT fetch error:", err);
    appendMessage('assistant', "⚠️ Error: Failed to connect to GPT.");
    if (loader) loader.classList.add('hidden');
  }
}

sendButton?.addEventListener('click', sendMessage);
resetButton?.addEventListener('click', resetChat);
userInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

toolButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('data-tool');
    currentTool = selected;
    resetChat();

    const toolData = promptConfig[selected];
    if (toolData?.starterPrompt) {
      appendMessage('assistant', toolData.starterPrompt);
      messageHistory.push({ role: 'assistant', content: toolData.starterPrompt });
    }
  });
});
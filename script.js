import { prompts } from './promptConfig.js';

let selectedTool = null;
const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const resetButton = document.getElementById('resetButton');
const loader = document.getElementById('loader');

function appendMessage(role, content) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble p-3 rounded-xl max-w-xl ${role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`;
  bubble.textContent = content;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function toggleLoader(show) {
  loader.classList.toggle('hidden', !show);
}

function resetChat() {
  chat.innerHTML = '';
  userInput.value = '';
}

function handleToolClick(tool) {
  selectedTool = tool;
  resetChat();
  const intro = prompts[tool]?.intro || `🤖 You selected: ${tool}. Ask your first question.`;
  appendMessage('assistant', intro);
}

function handleSend() {
  const input = userInput.value.trim();
  if (!input || !selectedTool) return;
  appendMessage('user', input);
  userInput.value = '';
  toggleLoader(true);

  fetch('/.netlify/functions/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: selectedTool, message: input })
  })
  .then(res => res.json())
  .then(data => {
    toggleLoader(false);
    const reply = data?.reply || '⚠️ Sorry, something went wrong.';
    appendMessage('assistant', reply);
  })
  .catch(err => {
    toggleLoader(false);
    console.error(err);
    appendMessage('assistant', '⚠️ Error connecting to GPT function.');
  });
}

document.querySelectorAll('.tool-button').forEach(button => {
  button.addEventListener('click', () => handleToolClick(button.dataset.tool));
});

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

resetButton.addEventListener('click', resetChat);

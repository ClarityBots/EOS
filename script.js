// /script.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tool-button");
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  let selectedTool = "";

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTool = button.dataset.tool;
      chatBox.innerHTML = `
        <div class="bot-message">🤖 I’m ClarityBot! Choose a tool to begin.</div>
        <div class="user-message">🛠 You selected: ${button.textContent}. Go ahead and ask your first question.</div>
      `;
    });
  });

  sendButton.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message || !selectedTool) return;

    // Show user message and loader
    chatBox.innerHTML += `<div class="user-message">${message}</div>`;
    chatBox.innerHTML += `<div class="bot-message" id="loading-message">🤖 Thinking...</div>`;
    userInput.value = "";

    try {
      const response = await fetch("/.netlify/functions/gpt", {
        method: "POST",
        body: JSON.stringify({ message, tool: selectedTool }),
      });

      const data = await response.json();

      // Remove loader and add GPT reply
      const loading = document.getElementById("loading-message");
      if (loading) loading.remove();

      chatBox.innerHTML += `<div class="bot-message">${data.reply}</div>`;
    } catch (err) {
      const loading = document.getElementById("loading-message");
      if (loading) loading.remove();

      chatBox.innerHTML += `<div class="bot-message">🤖 Sorry, something went wrong.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  });
});
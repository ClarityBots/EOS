// script.js

// Handles sending user input to the server-side function
async function sendMessage(userMessage) {
  const tool = "rocks"; // Default tool

  // POST to Netlify function
  const response = await fetch("/.netlify/functions/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: tool,
      userMessage: userMessage,
    }),
  });

  const data = await response.json();

  // Display messages
  displayUserMessage(userMessage);
  displayBotMessage(data.reply);
  document.getElementById("userInput").value = "";
}

// Appends the user's message to the chat
function displayUserMessage(message) {
  const chatBox = document.getElementById("chatBox");
  const userMessage = document.createElement("div");
  userMessage.className = "text-right";
  userMessage.innerHTML = `
    <div class="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-xl max-w-[80%]">
      ${escapeHtml(message)}
    </div>`;
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Appends the bot's reply to the chat
function displayBotMessage(message) {
  const chatBox = document.getElementById("chatBox");
  const botMessage = document.createElement("div");
  botMessage.className = "text-left";
  botMessage.innerHTML = `
    <div class="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-xl max-w-[80%]">
      ${escapeHtml(message)}
    </div>`;
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Escape HTML to prevent injection
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#039;");
}

// Send message on button click
document.getElementById("sendButton").addEventListener("click", () => {
  const input = document.getElementById("userInput").value;
  if (input.trim() !== "") {
    sendMessage(input);
  }
});

// Send message on Enter key press
document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("sendButton").click();
  }
});
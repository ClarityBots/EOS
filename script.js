let selectedTool = null;
let chatHistory = [];

const chatContainer = document.getElementById("chat");

function formatTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createChatBubble(message, isUser = false, skipSave = false, timestamp = null) {
  const bubble = document.createElement("div");
  bubble.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

  const inner = document.createElement("div");
  inner.className = `flex items-start space-x-2 max-w-[90%] ${isUser ? 'flex-row-reverse' : ''}`;

  const avatar = document.createElement("div");
  avatar.className = "text-2xl pt-1";
  avatar.textContent = isUser ? "🙂" : "🤖";

  const textBlock = document.createElement("div");
  textBlock.className = `chat-bubble p-3 rounded-xl shadow ${
    isUser ? 'bg-blue-500 text-white' : 'bg-blue-100 text-gray-900'
  }`;

  const text = document.createElement("div");
  text.textContent = message;

  const time = document.createElement("div");
  time.className = `text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`;
  time.textContent = timestamp || formatTimestamp();

  textBlock.appendChild(text);
  textBlock.appendChild(time);
  inner.appendChild(avatar);
  inner.appendChild(textBlock);
  bubble.appendChild(inner);

  chatContainer.appendChild(bubble);
  bubble.scrollIntoView({ behavior: "smooth" });

  if (!skipSave) {
    chatHistory.push({ message, isUser, timestamp: time.textContent });
    localStorage.setItem("clarityChat", JSON.stringify(chatHistory));
  }
}

function loadChatFromStorage() {
  const saved = localStorage.getItem("clarityChat");
  if (saved) {
    chatHistory = JSON.parse(saved);
    chatHistory.forEach(({ message, isUser, timestamp }) => {
      createChatBubble(message, isUser, true, timestamp);
    });
  } else {
    showWelcomeMessage();
  }
}

function showWelcomeMessage() {
  createChatBubble("👋 Welcome to ClarityBots! Select a tool above to get started.");
  setTimeout(() => {
    createChatBubble("💡 Tip: Press Enter to send, or Shift + Enter to add a new line.");
  }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tool-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTool = button.getAttribute("data-tool");
      chatHistory = [];
      localStorage.removeItem("clarityChat");
      chatContainer.innerHTML = "";

      // Load system + starter prompt from promptConfig
      const toolConfig = promptConfig[selectedTool];
      if (toolConfig?.starterPrompt) {
        createChatBubble(`🛠 You selected: ${button.textContent}`);
        setTimeout(() => {
          createChatBubble(toolConfig.starterPrompt);
        }, 300);
      } else {
        createChatBubble(`🛠 You selected: ${button.textContent}. Go ahead and ask your first question.`);
      }
    });
  });

  document.getElementById("sendButton").addEventListener("click", sendMessage);
  document.getElementById("resetButton").addEventListener("click", resetChat);

  document.getElementById("userInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  loadChatFromStorage();
});

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message || !selectedTool) return;

  createChatBubble(message, true);
  input.value = "";
  document.getElementById("loader").classList.remove("hidden");

  fetch("/.netlify/functions/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: selectedTool, message }),
  })
    .then((res) => res.json())
    .then((data) => {
      const botReply = data.reply || "⚠️ Hmm, I couldn’t generate a response. Try rephrasing your question.";
      createChatBubble(botReply);
    })
    .catch((err) => {
      console.error(err);
      createChatBubble("⚠️ Sorry, something went wrong. Please try again.");
    })
    .finally(() => {
      document.getElementById("loader").classList.add("hidden");
    });
}

function resetChat() {
  chatContainer.innerHTML = "";
  chatHistory = [];
  localStorage.removeItem("clarityChat");

  if (selectedTool) {
    const toolConfig = promptConfig[selectedTool];
    createChatBubble(`🛠 You selected: ${selectedTool}`);
    setTimeout(() => {
      if (toolConfig?.starterPrompt) {
        createChatBubble(toolConfig.starterPrompt);
      }
    }, 300);
  } else {
    showWelcomeMessage();
  }
}

// Export chat to text file
function exportChat() {
  if (!chatHistory.length) return alert("No chat history to export.");
  const lines = chatHistory.map(entry => {
    const who = entry.isUser ? "You" : "ClarityBot";
    return `[${entry.timestamp}] ${who}: ${entry.message}`;
  });
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ClarityChat.txt";
  link.click();
}

// Add Export Button
const exportBtn = document.createElement("button");
exportBtn.textContent = "Download Chat";
exportBtn.className = "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow mt-4";
exportBtn.addEventListener("click", exportChat);
document.querySelector(".flex.flex-col.space-y-4")?.appendChild(exportBtn);
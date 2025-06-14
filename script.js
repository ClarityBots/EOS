// script.js

let selectedTool = null;
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const messagesDiv = document.getElementById("messages");
const toolButtons = document.querySelectorAll(".tool-button");

// Load client-specific theming
importConfig();

// Tool selection logic
toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTool = button.getAttribute("data-tool");
    messagesDiv.innerHTML = "";

    const { promptConfig } = window;
    const tool = promptConfig[selectedTool];

    if (tool?.welcomeMessage) {
      addMessage("🤖", tool.welcomeMessage);
    } else {
      addMessage("🤖", "You selected a tool. Ask your first question!");
    }
  });
});

// Chat form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message || !selectedTool) return;

  addMessage("🧑‍💼", message);
  userInput.value = "";

  addLoader();

  try {
    const response = await fetch("/.netlify/functions/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        tool: selectedTool,
      }),
    });

    removeLoader();

    if (!response.ok) {
      throw new Error("GPT Error");
    }

    const data = await response.json();
    if (data && data.reply) {
      addMessage("🤖", data.reply);
    } else {
      handleFallback();
    }
  } catch (error) {
    console.error(error);
    removeLoader();
    handleFallback();
  }
});

// Helper functions
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("p-2", "rounded", "shadow", "bg-gray-100");
  messageDiv.innerHTML = `<strong>${sender}</strong><br>${formatText(text)}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addLoader() {
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.classList.add("p-2", "text-sm", "text-gray-500");
  loader.textContent = "🤖 Thinking...";
  messagesDiv.appendChild(loader);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

function handleFallback() {
  const fallback =
    window.promptConfig?.[selectedTool]?.fallbackMessage ||
    "⚠️ Something went wrong. Please try again.";
  addMessage("🤖", fallback);
}

function formatText(text) {
  return text
    .replace(/\n/g, "<br>")
    .replace(/•/g, "•&nbsp;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// Load logo, background, and theming
function importConfig() {
  import("./clientConfig.js")
    .then((module) => {
      const { clients } = module;
      const query = new URLSearchParams(window.location.search);
      const clientKey = query.get("client") || "business_intuition";
      const client = clients[clientKey];

      if (client) {
        document.getElementById("client-logo").src = client.logo;
        document.getElementById("client-logo").alt = client.altText;
        document.getElementById("client-heading").textContent = client.heading;

        if (client.background) {
          document.getElementById("body").style.backgroundImage = `url('${client.background}')`;
        }

        if (client.brandColor) {
          document.querySelector("meta[name='theme-color']").setAttribute("content", client.brandColor);
        }

        if (client.preloadImage) {
          const preload = document.createElement("link");
          preload.rel = "preload";
          preload.as = "image";
          preload.href = client.background;
          document.head.appendChild(preload);
        }
      }
    })
    .catch((err) => console.error("Client config error:", err));
}
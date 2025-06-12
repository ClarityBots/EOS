async function sendToOpenAI() {
  const userInput = document.getElementById('userInput').value;
  const responseArea = document.getElementById('responseArea');
  const clearBtn = document.getElementById('clearButton');

  responseArea.innerText = "Thinking...";
  clearBtn.disabled = true;

  try {
    const res = await fetch("/.netlify/functions/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await res.json();
    clearBtn.disabled = false;

    if (data.reply) {
      responseArea.innerText = data.reply;
    } else if (data.error) {
      responseArea.innerText = "OpenAI Error: " + data.error;
    } else {
      responseArea.innerText = "Unexpected response from server.";
    }
  } catch (err) {
    clearBtn.disabled = false;
    responseArea.innerText = "Network Error: " + err.message;
  }
}

function clearChat() {
  document.getElementById('userInput').value = "";
  document.getElementById('responseArea').innerText = "";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
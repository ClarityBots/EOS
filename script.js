async function sendToOpenAI() {
  const userInput = document.getElementById('userInput').value;
  const responseArea = document.getElementById('responseArea');
  responseArea.innerText = "Thinking...";

  try {
    const res = await fetch("/.netlify/functions/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await res.json();

    if (data.reply) {
      responseArea.innerText = data.reply;
    } else if (data.error) {
      responseArea.innerText = "OpenAI Error: " + data.error;
    } else {
      responseArea.innerText = "Unexpected response from server.";
    }
  } catch (err) {
    responseArea.innerText = "Network Error: " + err.message;
  }
}
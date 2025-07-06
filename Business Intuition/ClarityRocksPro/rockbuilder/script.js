document.addEventListener("DOMContentLoaded", () => {
  const chatLog = document.getElementById('chat-log');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  const steps = [
    {
      key: 'specific',
      prompt: "Let's make this Rock specific. What exactly must be accomplished — no fluff, just the real outcome?"
    },
    {
      key: 'measurable',
      prompt: "How will we know — objectively — when it's 100% done? What does success look like, clearly measured?"
    },
    {
      key: 'achievable',
      prompt: "Gut check: Can this actually be completed within the next 90 days with current resources?"
    },
    {
      key: 'relevant',
      prompt: "How does this Rock tie back to the company's priorities or current Push Initiative?"
    },
    {
      key: 'timeBound',
      prompt: "What’s the firm due date? Be exact — no fuzzy deadlines."
    }
  ];

  let stepIndex = 0;
  const responses = {};

  function addMessage(text, sender) {
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    message.innerHTML = text;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function nextStep() {
    if (stepIndex < steps.length) {
      const { prompt } = steps[stepIndex];
      addMessage(prompt, 'ai');
    } else {
      const summary = `
🪨 <strong>SMART Rock Summary</strong>

<strong>• Specific:</strong> ${responses.specific}
<strong>• Measurable:</strong> ${responses.measurable}
<strong>• Achievable:</strong> ${responses.achievable}
<strong>• Relevant:</strong> ${responses.relevant}
<strong>• Time-Bound:</strong> ${responses.timeBound}
      `.trim();
      addMessage(summary, 'ai');
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatInput.value.trim();
    if (!input) return;

    addMessage(input, 'user');

    const currentStep = steps[stepIndex];
    if (currentStep) {
      responses[currentStep.key] = input;
    }

    stepIndex++;
    chatInput.value = '';
    setTimeout(nextStep, 500);
  });

  nextStep(); // Start the flow
});

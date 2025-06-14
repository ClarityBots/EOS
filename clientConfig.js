export const clients = {
  business_intuition: {
    heading: "Business Intuition's",
    background: "images/business_intuition_image.jpg",
    logo: "images/business_intuition_logo.svg",
    altText: "Business Intuition Logo",
    website: "https://claritybots.ai",
    brandColor: "#F04E23",
    overlayOpacity: 0.7
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("client") || "business_intuition";
  const client = clients[clientId];

  if (!client) return;

  document.getElementById("backgroundImage").style.backgroundImage = `url(${client.background})`;
  document.getElementById("overlayLayer").style.opacity = client.overlayOpacity ?? 0.7;
  document.getElementById("clientLogo").src = client.logo;
  document.getElementById("clientLogo").alt = client.altText;
  document.getElementById("clientHeading").textContent = `${client.heading} ClarityBot`;
  document.getElementById("clientWebsite").href = client.website;

  const tools = ["rocks", "ids", "scorecard", "core_values", "available"];
  const labels = {
    rocks: "SMART Rocks",
    ids: "IDS",
    scorecard: "Scorecard",
    core_values: "Core Values",
    available: "Available Tools"
  };

  const toolContainer = document.getElementById("toolContainer");
  tools.forEach(tool => {
    const btn = document.createElement("button");
    btn.className = "tool-button hover:brightness-110 text-white font-semibold px-4 py-2 rounded-2xl shadow text-sm sm:text-base";
    btn.style.backgroundColor = client.brandColor;
    btn.setAttribute("data-tool", tool);
    btn.textContent = labels[tool];
    toolContainer.appendChild(btn);
  });

  document.getElementById("sendButton").style.backgroundColor = client.brandColor;
});
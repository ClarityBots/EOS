export const clients = {
  default: {
    heading: "ClarityBots®",
    background: "images/default_background.jpg",
    logo: "images/default_logo.png",
    altText: "ClarityBots Logo",
    preloadImage: true,
    basePath: "images/",
    brandColor: "#142233",
    opacity: 0.2
  },
  business_intuition: {
    heading: "Business Intuition's Tools",
    background: "images/business_intuition_background.jpg",
    logo: "images/business_intuition_logo.svg",
    altText: "Business Intuition Logo",
    preloadImage: true,
    basePath: "images/",
    brandColor: "#F04E23",
    opacity: 0.15
  },
  cop: {
    heading: "COP Construction's Tools",
    background: "images/cop_background.jpg",
    logo: "images/cop_logo.png",
    altText: "COP Construction Logo",
    preloadImage: true,
    basePath: "images/",
    brandColor: "#6C7C90",
    opacity: 0.25
  }
};

const urlParams = new URLSearchParams(window.location.search);
const clientKey = urlParams.get('client') || 'default';
const client = clients[clientKey] || clients.default;

const headingEl = document.getElementById('clientHeading');
const logoEl = document.getElementById('clientLogo');
const backgroundEl = document.getElementById('backgroundImage');
const overlayEl = document.getElementById('overlayLayer');

if (client) {
  headingEl.innerHTML = client.heading;
  logoEl.src = client.logo;
  logoEl.alt = client.altText;
  backgroundEl.style.backgroundImage = `url('${client.background}')`;
  backgroundEl.style.opacity = client.opacity.toString();
  if (client.brandColor) {
    document.getElementById('sendButton').style.backgroundColor = client.brandColor;
  }
}
// clientConfig.js

export const clients = {
  alder: {
    heading: "Alder Construction's",
    assets: {
      background: "images/alder_image.jpg",
      logo: "images/alder_logo.png",
    },
    brand: {
      color: "#445777",
      fontColor: "#ffffff",
      overlayTint: "rgba(0, 0, 0, 0.3)",
    },
    logoPosition: "bottom-right",
    ctaLinks: [
      { label: "Build SMART Rocks", url: "https://example.com/alder-rocks" },
      { label: "View Scorecard", url: "https://example.com/alder-scorecard" },
    ],
  },

  business_intuition: {
    heading: "Business Intuition's",
    assets: {
      background: "images/business_intuition_image.jpg",
      logo: "images/business_intuition_logo.svg",
    },
    brand: {
      color: "#F04E23",
      fontColor: "#ffffff",
      overlayTint: "rgba(0, 0, 0, 0.2)",
    },
    logoPosition: "bottom-right",
    ctaLinks: [
      { label: "ClarityBots Home", url: "https://claritybots.ai/" }
    ],
  },

  cop: {
    heading: "COP Construction's",
    assets: {
      background: "images/cop_image.jpg",
      logo: "images/cop_logo.png",
    },
    brand: {
      color: "#6C7C90",
      fontColor: "#ffffff",
      overlayTint: "rgba(0, 0, 0, 0.25)",
    },
    logoPosition: "bottom-left",
    ctaLinks: [],
  },

  remedyww: {
    heading: "Remedy World Wide's",
    assets: {
      background: "images/remedyww_image.jpg",
      logo: "images/remedyww_logo.png",
    },
    brand: {
      color: "#A9B7C6",
      fontColor: "#000000",
      overlayTint: "rgba(255, 255, 255, 0.2)",
    },
    logoPosition: "bottom-right",
    ctaLinks: [],
  },

  skyline: {
    heading: "Skyline Electric's",
    assets: {
      background: "images/skyline_image.png",
      logo: "images/skyline_logo.png",
    },
    brand: {
      color: "#FBBF24",
      fontColor: "#142233",
      overlayTint: "rgba(255, 255, 255, 0.15)",
    },
    logoPosition: "bottom-left",
    ctaLinks: [],
  },

  vlcm: {
    heading: "VLCM's",
    assets: {
      background: "images/vlcm_image.jpg",
      logo: "images/vlcm_logo.svg",
    },
    brand: {
      color: "#28A745",
      fontColor: "#ffffff",
      overlayTint: "rgba(0, 0, 0, 0.2)",
    },
    logoPosition: "bottom-right",
    ctaLinks: [],
  },

  winward: {
    heading: "Winward Electric's",
    assets: {
      background: "images/winward_image.jpg",
      logo: "images/winward_logo.png",
    },
    brand: {
      color: "#9C27B0",
      fontColor: "#ffffff",
      overlayTint: "rgba(0, 0, 0, 0.3)",
    },
    logoPosition: "bottom-right",
    ctaLinks: [],
  },

  // 🌐 Fallback configuration
  default: {
    heading: "ClarityBots",
    assets: {
      background: "images/default_background.jpg",
      logo: "images/default_logo.png",
    },
    brand: {
      color: "#FF7900",
      fontColor: "#ffffff",
      overlayTint: "rgba(0, 0, 0, 0.2)",
    },
    logoPosition: "bottom-right",
    ctaLinks: [
      { label: "Visit ClarityBots", url: "https://claritybots.ai/" }
    ],
  },
};

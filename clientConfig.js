:root {
  --orange: #ff7900;
  --red-orange: #f04e23;
  --light-gray: #999999;
  --lightest-gray: #f5f5f5;
  --navy: #142233;

  --layer-content: 2;
  --layer-bg: -1;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  height: 100%;
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  line-height: 1.5;
  color: #fff;
  background-color: var(--navy);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  text-align: center;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

header {
  margin-bottom: 0.5rem;
}

body::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 2, 0, 0.05);
  z-index: var(--layer-bg);
}

:is(h1, h2, h3) {
  position: relative;
  z-index: var(--layer-content);
  text-shadow: 2px 2px 4px #000;
  animation: fadeInDown 1s ease-out forwards;
  animation-fill-mode: both;
  margin: 0;
}

h1 {
  font-size: 2.5rem;
  color: var(--lightest-gray);
  margin-bottom: 0.1rem;
}

h2 {
  font-size: 2.25rem;
  color: var(--orange);
  margin-bottom: 0.1rem;
}

h3 {
  font-size: 1.75rem;
  color: var(--orange);
  font-style: italic;
  margin-bottom: 0.1rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
  z-index: var(--layer-content);
  animation: fadeInUp 1.5s ease-out;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background-color: var(--red-orange);
  border-radius: 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  width: 100%;
  min-width: 200px;
  text-align: center;
}

.button:hover {
  background-color: var(--orange);
  transform: scale(1.05);
}

.watermark {
  position: absolute;
  bottom: 20px;
  right: 20px;
  max-width: 150px;
  opacity: 0.9;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
  z-index: var(--layer-content);
}

.footer {
  padding: 1rem;
  color: var(--lightest-gray);
  font-size: 0.875rem;
  text-align: center;
  z-index: var(--layer-content);
  font-weight: 300;
  opacity: 0.8;
}

@media (max-width: 560px) {
  h1 {
    font-size: 2rem;
    margin-bottom: 0.1rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 0.1rem;
  }

  h3 {
    font-size: 1.5rem;
    font-style: italic;
    margin-bottom: 0.1rem;
  }

  .button {
    font-size: 1rem;
    padding: 0.75rem;
    min-width: 200px;
    text-align: center;
  }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}

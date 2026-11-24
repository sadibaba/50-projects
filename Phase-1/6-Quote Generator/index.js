const button = document.querySelector("#btn");
const authorEl = document.querySelector("#author");
const quoteEl = document.querySelector("#quote");
const statusEl = document.querySelector("#status");

const fallback = {
  quote: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
};

async function loadQuote() {
  button.disabled = true;
  statusEl.textContent = "Loading a quote...";

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("The quote service is unavailable.");

    const data = await response.json();
    quoteEl.textContent = `“${data.quote}”`;
    authorEl.textContent = data.author ? `— ${data.author}` : "— Unknown";
    statusEl.textContent = "";
  } catch (error) {
    quoteEl.textContent = `“${fallback.quote}”`;
    authorEl.textContent = `— ${fallback.author}`;
    statusEl.textContent = `${error.message} Showing a saved quote instead.`;
  } finally {
    button.disabled = false;
  }
}

button.addEventListener("click", loadQuote);
loadQuote();

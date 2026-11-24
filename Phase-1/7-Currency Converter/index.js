const amountInput = document.querySelector("#amount");
const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const swapButton = document.querySelector("#swap");
const convertButton = document.querySelector("#convert");
const resultEl = document.querySelector("#result");
const rateEl = document.querySelector("#rate");
const statusEl = document.querySelector("#status");

const currencies = [
  ["USD", "US Dollar"],
  ["PKR", "Pakistani Rupee"],
  ["EUR", "Euro"],
  ["GBP", "British Pound"],
  ["INR", "Indian Rupee"],
  ["AED", "UAE Dirham"],
  ["SAR", "Saudi Riyal"],
  ["CAD", "Canadian Dollar"],
  ["AUD", "Australian Dollar"],
  ["JPY", "Japanese Yen"],
  ["CNY", "Chinese Yuan"],
  ["TRY", "Turkish Lira"],
  ["BDT", "Bangladeshi Taka"],
  ["MYR", "Malaysian Ringgit"],
];

let latestRates = null;
let latestBase = null;

function fillSelects() {
  currencies.forEach(([code, name]) => {
    fromSelect.add(new Option(`${code} - ${name}`, code));
    toSelect.add(new Option(`${code} - ${name}`, code));
  });

  fromSelect.value = "USD";
  toSelect.value = "PKR";
}

function setStatus(message) {
  statusEl.textContent = message;
}

async function loadRate(base) {
  setStatus("");
  rateEl.textContent = "Fetching the latest rate...";

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!response.ok) throw new Error("The exchange service is unavailable.");

    const data = await response.json();
    if (data.result !== "success" || !data.rates) {
      throw new Error("The exchange service returned an invalid response.");
    }

    latestRates = data.rates;
    latestBase = base;
    return data.rates;
  } catch (error) {
    latestRates = null;
    setStatus(`${error.message} Try again in a moment.`);
    rateEl.textContent = "Rate unavailable.";
    return null;
  }
}

async function convert() {
  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount < 0) {
    setStatus("Enter a valid amount.");
    return;
  }

  const from = fromSelect.value;
  const to = toSelect.value;

  convertButton.disabled = true;

  const rates = latestBase === from && latestRates ? latestRates : await loadRate(from);
  convertButton.disabled = false;

  if (!rates || !rates[to]) {
    resultEl.textContent = "--";
    return;
  }

  const converted = amount * rates[to];
  resultEl.textContent = `${converted.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })} ${to}`;

  rateEl.textContent = `1 ${from} = ${rates[to].toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })} ${to}`;
  setStatus("");
}

swapButton.addEventListener("click", () => {
  const from = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = from;
  latestRates = null;
  convert();
});

convertButton.addEventListener("click", convert);

amountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") convert();
});

fromSelect.addEventListener("change", () => {
  latestRates = null;
  convert();
});

toSelect.addEventListener("change", convert);

fillSelects();
convert();

const billDisplay = document.getElementById("billDisplay");
const tipPercent = document.getElementById("tipPercent");
const splitCount = document.getElementById("splitCount");
const splitTotal = document.getElementById("splitTotal");

const tipMinus = document.getElementById("tipMinus");
const tipPlus = document.getElementById("tipPlus");
const splitMinus = document.getElementById("splitMinus");
const splitPlus = document.getElementById("splitPlus");

const keypadButtons = document.querySelectorAll(".key");
const keyBack = document.getElementById("keyBack");
const clearAll = document.getElementById("clearAll");
const confirm = document.getElementById("confirm");

let billRaw = "";
let tip = 10;
let split = 1;

function parseBill() {
  const n = parseFloat(billRaw || "0");
  return isNaN(n) ? 0 : n;
}

function formatMoney(v) {
  return v.toFixed(2);
}

function updateDisplays() {
  billDisplay.textContent = formatMoney(parseBill());
  tipPercent.textContent = tip + "%";
  splitCount.textContent = split;

  const bill = parseBill();
  const tipAmount = bill * (tip / 100);
  const grand = bill + tipAmount;
  const perHead = split > 0 ? grand / split : grand;
  splitTotal.textContent = formatMoney(perHead);
}

function handleKeypadInput(k) {
  if (k === ".") {
    if (!billRaw.includes(".")) billRaw = billRaw === "" ? "0." : billRaw + ".";
  } else {
    if (billRaw.length >= 12) return;
    const next = billRaw + k;
    const parts = next.split(".");
    if (parts[1] && parts[1].length > 2) return;
    billRaw = next.replace(/^0{2,}/, "0");
  }
  updateDisplays();
}

keypadButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const k = btn.getAttribute("data-key");
    handleKeypadInput(k);
  });
});

keyBack.addEventListener("click", () => {
  billRaw = billRaw.slice(0, -1);
  updateDisplays();
});

clearAll.addEventListener("click", () => {
  billRaw = "";
  tip = 10;
  split = 1;
  updateDisplays();
});

tipMinus.addEventListener("click", () => {
  tip = Math.max(0, tip - 1);
  updateDisplays();
});

tipPlus.addEventListener("click", () => {
  tip = Math.min(100, tip + 1);
  updateDisplays();
});

splitMinus.addEventListener("click", () => {
  split = Math.max(1, split - 1);
  updateDisplays();
});

splitPlus.addEventListener("click", () => {
  split = Math.min(50, split + 1);
  updateDisplays();
});

confirm.addEventListener("click", () => {
  confirm.classList.add("scale-95");
  setTimeout(() => confirm.classList.remove("scale-95"), 120);
});

updateDisplays();

const weightDisplay = document.getElementById("weightDisplay");
const heightDisplay = document.getElementById("heightDisplay");
const weightUnitLabel = document.getElementById("weightUnitLabel");
const heightUnitLabel = document.getElementById("heightUnitLabel");

const kgBtn = document.getElementById("kgBtn");
const lbBtn = document.getElementById("lbBtn");
const cmBtn = document.getElementById("cmBtn");
const inBtn = document.getElementById("inBtn");

const keypadButtons = document.querySelectorAll(".key");
const keyBack = document.getElementById("keyBack");
const targetWeightBtn = document.getElementById("targetWeight");
const targetHeightBtn = document.getElementById("targetHeight");
const clearAll = document.getElementById("clearAll");
const calculate = document.getElementById("calculate");

const bmiValue = document.getElementById("bmiValue");
const bmiBadge = document.getElementById("bmiBadge");

let inputTarget = "weight";
let weightRaw = "";
let heightRaw = "";

let weightUnit = "kg";
let heightUnit = "cm";

function formatNum(str) {
  const n = parseFloat(str || "0");
  return isNaN(n) ? 0 : n;
}

function safeAppend(current, k) {
  if (k === ".") {
    if (!current.includes(".")) current = current === "" ? "0." : current + ".";
    return current;
  }
  if (current.length >= 10) return current;
  const next = current + k;
  const parts = next.split(".");
  if (parts[1] && parts[1].length > 2) return current;
  return next.replace(/^0{2,}/, "0");
}

function updateDisplays() {
  weightDisplay.textContent = formatNum(weightRaw).toFixed(1);
  heightDisplay.textContent = formatNum(heightRaw).toFixed(1);
  weightUnitLabel.textContent = weightUnit;
  heightUnitLabel.textContent = heightUnit;
}

function toMetric(weightVal, heightVal) {
  let w = weightVal;
  let h = heightVal;

  if (weightUnit === "lb") w = w * 0.45359237;
  if (heightUnit === "cm") h = h / 100;
  if (heightUnit === "in") h = h * 0.0254;

  return { wKg: w, hM: h };
}

function bmiCategory(bmi) {
  if (!isFinite(bmi) || bmi <= 0)
    return { label: "—", color: "bg-neutral-600" };
  if (bmi < 18.5) return { label: "Underweight", color: "bg-blue-600" };
  if (bmi < 25) return { label: "Normal", color: "bg-emerald-600" };
  if (bmi < 30) return { label: "Overweight", color: "bg-amber-600" };
  return { label: "Obese", color: "bg-red-600" };
}

function computeBMI() {
  const w = formatNum(weightRaw);
  const h = formatNum(heightRaw);
  const { wKg, hM } = toMetric(w, h);
  if (hM <= 0) return 0;
  return wKg / (hM * hM);
}

function updateBMI() {
  const bmi = computeBMI();
  bmiValue.textContent = isFinite(bmi) ? bmi.toFixed(1) : "0.0";
  const cat = bmiCategory(bmi);
  bmiBadge.textContent = cat.label;
  bmiBadge.className = "badge " + cat.color;
}

keypadButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const k = btn.getAttribute("data-key");
    if (inputTarget === "weight") {
      weightRaw = safeAppend(weightRaw, k);
    } else {
      heightRaw = safeAppend(heightRaw, k);
    }
    updateDisplays();
    updateBMI();
  });
});

keyBack.addEventListener("click", () => {
  if (inputTarget === "weight") {
    weightRaw = weightRaw.slice(0, -1);
  } else {
    heightRaw = heightRaw.slice(0, -1);
  }
  updateDisplays();
  updateBMI();
});

targetWeightBtn.addEventListener("click", () => {
  inputTarget = "weight";
  targetWeightBtn.classList.add("bg-neutral-600");
  targetHeightBtn.classList.remove("bg-neutral-600");
});

targetHeightBtn.addEventListener("click", () => {
  inputTarget = "height";
  targetHeightBtn.classList.add("bg-neutral-600");
  targetWeightBtn.classList.remove("bg-neutral-600");
});

kgBtn.addEventListener("click", () => {
  weightUnit = "kg";
  kgBtn.classList.add("bg-neutral-600");
  lbBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});
lbBtn.addEventListener("click", () => {
  weightUnit = "lb";
  lbBtn.classList.add("bg-neutral-600");
  kgBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});

cmBtn.addEventListener("click", () => {
  heightUnit = "cm";
  cmBtn.classList.add("bg-neutral-600");
  inBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});
inBtn.addEventListener("click", () => {
  heightUnit = "in";
  inBtn.classList.add("bg-neutral-600");
  cmBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});

clearAll.addEventListener("click", () => {
  weightRaw = "";
  heightRaw = "";
  weightUnit = "kg";
  heightUnit = "cm";
  inputTarget = "weight";
  kgBtn.classList.add("bg-neutral-600");
  lbBtn.classList.remove("bg-neutral-600");
  cmBtn.classList.add("bg-neutral-600");
  inBtn.classList.remove("bg-neutral-600");
  targetWeightBtn.classList.add("bg-neutral-600");
  targetHeightBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});

calculate.addEventListener("click", () => {
  calculate.classList.add("scale-95");
  setTimeout(() => calculate.classList.remove("scale-95"), 120);
  updateBMI();
});

kgBtn.classList.add("bg-neutral-600");
cmBtn.classList.add("bg-neutral-600");
targetWeightBtn.classList.add("bg-neutral-600");
updateDisplays();
updateBMI();

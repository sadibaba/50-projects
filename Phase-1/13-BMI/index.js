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
const healthyRange = document.getElementById("healthyRange");
const statusEl = document.getElementById("status");

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

  const height = formatNum(heightRaw);
  const heightM = heightUnit === "cm" ? height / 100 : height * 0.0254;

  if (heightM > 0) {
    const minKg = 18.5 * heightM * heightM;
    const maxKg = 24.9 * heightM * heightM;
    const toDisplay = (kg) =>
      weightUnit === "kg" ? kg : kg * 2.2046226218;

    healthyRange.textContent = `Healthy weight range for this height: ${toDisplay(minKg).toFixed(1)}–${toDisplay(maxKg).toFixed(1)} ${weightUnit}.`;
  } else {
    healthyRange.textContent = "Enter a height to see the healthy weight range.";
  }

  if (bmi > 0 && cat.label !== "—") {
    statusEl.textContent = `BMI ${bmi.toFixed(1)} falls in the ${cat.label.toLowerCase()} range.`;
  } else {
    statusEl.textContent = "";
  }
}

function convertWeight(nextUnit) {
  if (nextUnit === weightUnit) return;
  const value = formatNum(weightRaw);
  const converted = nextUnit === "lb" ? value * 2.2046226218 : value / 2.2046226218;
  weightRaw = value > 0 ? converted.toFixed(2).replace(/\.?0+$/, "") : "";
}

function convertHeight(nextUnit) {
  if (nextUnit === heightUnit) return;
  const value = formatNum(heightRaw);
  const converted = nextUnit === "in" ? value / 2.54 : value * 2.54;
  heightRaw = value > 0 ? converted.toFixed(2).replace(/\.?0+$/, "") : "";
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
  if (weightUnit === "lb") convertWeight("kg");
  weightUnit = "kg";
  kgBtn.classList.add("bg-neutral-600");
  lbBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});
lbBtn.addEventListener("click", () => {
  if (weightUnit === "kg") convertWeight("lb");
  weightUnit = "lb";
  lbBtn.classList.add("bg-neutral-600");
  kgBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});

cmBtn.addEventListener("click", () => {
  if (heightUnit === "in") convertHeight("cm");
  heightUnit = "cm";
  cmBtn.classList.add("bg-neutral-600");
  inBtn.classList.remove("bg-neutral-600");
  updateDisplays();
  updateBMI();
});
inBtn.addEventListener("click", () => {
  if (heightUnit === "cm") convertHeight("in");
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

  if (formatNum(weightRaw) <= 0 || formatNum(heightRaw) <= 0) {
    statusEl.textContent = "Enter both a weight and a height to calculate BMI.";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (/^[0-9]$/.test(event.key)) {
    if (inputTarget === "weight") {
      weightRaw = safeAppend(weightRaw, event.key);
    } else {
      heightRaw = safeAppend(heightRaw, event.key);
    }
    updateDisplays();
    updateBMI();
  } else if (event.key === ".") {
    if (inputTarget === "weight") {
      weightRaw = safeAppend(weightRaw, ".");
    } else {
      heightRaw = safeAppend(heightRaw, ".");
    }
    updateDisplays();
    updateBMI();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    if (inputTarget === "weight") {
      weightRaw = weightRaw.slice(0, -1);
    } else {
      heightRaw = heightRaw.slice(0, -1);
    }
    updateDisplays();
    updateBMI();
  }
});

kgBtn.classList.add("bg-neutral-600");
cmBtn.classList.add("bg-neutral-600");
targetWeightBtn.classList.add("bg-neutral-600");
updateDisplays();
updateBMI();

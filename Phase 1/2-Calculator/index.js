  const countsEl = document.getElementById('counts');
  const totalEl = document.getElementById('total');
  const cardEl = document.getElementById('calculatorCard');
  const displayArea = document.getElementById('displayArea');
  const themeToggle = document.getElementById('themeToggle');

  const btns = {
    digits: [...Array(10)].map((_, i) => document.getElementById('btn' + i)),
    dot: document.getElementById('btnDot'),
    ac: document.getElementById('btnAC'),
    pm: document.getElementById('btnPlusMinus'),
    percent: document.getElementById('btnPercent'),
    add: document.getElementById('btnAdd'),
    sub: document.getElementById('btnSubtract'),
    mul: document.getElementById('btnMultiply'),
    div: document.getElementById('btnDivide'),
    eq: document.getElementById('btnEquals'),
  };

  let current = '0';
  let previous = null;
  let operator = null;
  let overwrite = false; 

  function formatNumber(nStr) {
    const n = Number(nStr);
    if (!isFinite(n)) return 'Error';
    const [intPart, decPart] = nStr.includes('.') ? nStr.split('.') : [nStr, null];
    const intFormatted = Number(intPart).toLocaleString('en-US');
    return decPart !== null ? `${intFormatted}.${decPart}` : intFormatted;
  }

  function updateDisplay() {
    totalEl.textContent = `${formatNumber(current)}`;
    countsEl.textContent = buildCountsText();
  }

  function buildCountsText() {
    const opToSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    if (previous === null && operator === null) return '';
    const prev = formatNumber(previous ?? '0');
    const curr = formatNumber(current);
    if (operator && previous !== null) {
      return `${prev} ${opToSymbol[operator]} ${curr}`;
    }
    return prev;
  }

  function chooseOperator(nextOp) {
    if (operator && previous !== null) {
      const result = compute(previous, current, operator);
      previous = result;
      current = '0';
    } else {
      previous = current;
      current = '0';
    }
    operator = nextOp;
    overwrite = false;
    updateDisplay();
  }

  function compute(aStr, bStr, op) {
    const a = Number(aStr);
    const b = Number(bStr);
    switch (op) {
      case '+': return String(a + b);
      case '-': return String(a - b);
      case '*': return String(a * b);
      case '/': return b === 0 ? 'Infinity' : String(a / b);
      default: return String(b);
    }
  }

  function pressEquals() {
    if (operator === null || previous === null) return;
    const result = compute(previous, current, operator);
    current = result;
    previous = null;
    operator = null;
    overwrite = true;
    updateDisplay();
  }

  function appendDigit(d) {
    if (overwrite) {
      current = String(d);
      overwrite = false;
      updateDisplay();
      return;
    }
    if (current === '0') {
      current = String(d);
    } else {
      current += String(d);
    }
    updateDisplay();
  }

  function appendDot() {
    if (overwrite) {
      current = '0.';
      overwrite = false;
      updateDisplay();
      return;
    }
    if (!current.includes('.')) {
      current += '.';
      updateDisplay();
    }
  }

  function toggleSign() {
    if (current === '0') return;
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
    updateDisplay();
  }

  function percent() {
    const n = Number(current);
    current = String(n / 100);
    updateDisplay();
  }

  function allClear() {
    current = '0';
    previous = null;
    operator = null;
    overwrite = false;
    updateDisplay();
  }

  btns.digits.forEach((btn, i) => {
    btn.addEventListener('click', () => appendDigit(i));
  });
  btns.dot.addEventListener('click', appendDot);
  btns.pm.addEventListener('click', toggleSign);
  btns.percent.addEventListener('click', percent);
  btns.ac.addEventListener('click', allClear);

  btns.add.addEventListener('click', () => chooseOperator('+'));
  btns.sub.addEventListener('click', () => chooseOperator('-'));
  btns.mul.addEventListener('click', () => chooseOperator('*'));
  btns.div.addEventListener('click', () => chooseOperator('/'));
  btns.eq.addEventListener('click', pressEquals);

  updateDisplay();

  themeToggle.addEventListener('change', (e) => {
    const dark = e.target.checked;

    cardEl.classList.toggle('bg-neutral-900', dark);
    cardEl.classList.toggle('bg-white', !dark);

    displayArea.classList.toggle('bg-neutral-800', dark);
    displayArea.classList.toggle('bg-neutral-100', !dark);

    countsEl.classList.toggle('text-neutral-300', dark);
    countsEl.classList.toggle('text-neutral-500', !dark);

    totalEl.classList.toggle('text-neutral-100', dark);
    totalEl.classList.toggle('text-neutral-900', !dark);

    const neutralBtns = [
      'btn7','btn8','btn9','btn4','btn5','btn6','btn1','btn2','btn3','btn0','btnDot',
      'btnAC','btnPlusMinus','btnPercent'
    ].map(id => document.getElementById(id));

    neutralBtns.forEach(b => {
      b.classList.toggle('bg-neutral-800', dark);
      b.classList.toggle('text-neutral-100', dark);
      b.classList.toggle('bg-neutral-100', !dark);
      b.classList.toggle('text-neutral-900', !dark);
    });

    ['btnAdd','btnSubtract','btnMultiply','btnDivide','btnEquals'].forEach(id => {
      const b = document.getElementById(id);
      b.classList.toggle('bg-orange-400', dark);
      b.classList.toggle('bg-orange-500', !dark);
      if (id === 'btnEquals') {
        b.classList.toggle('bg-orange-500', dark);
        b.classList.toggle('bg-orange-600', !dark);
      }
    });
  });

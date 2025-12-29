const exchange = document.querySelector('#exchange')
const inputs =document.querySelector('#inputs')
const btnSub =document.querySelector('#btn-sub')


const firstPara = exchange.querySelector('#first');
const secPara = exchange.querySelector('#sec');
const input1 = inputs.querySelector('#in-1');
const input2 = inputs.querySelector('#in-2');


btnSub.addEventListener('click', async () => {
  try {
    const res = await fetch('https://hexarate.paikama.co/api/rates/USD/PKR/latest');
    const data = await res.json();

    const rate = data.data.mid; 

    if (!rate || isNaN(rate)) {
      throw new Error("Invalid rate from API");
    }

    const usdValue = parseFloat(input1.value);

    if (isNaN(usdValue)) {
      firstPara.textContent = "Please enter a valid USD amount";
      secPara.textContent = "";
      return;
    }

    const pkrValue = usdValue * rate;

    firstPara.textContent = `${usdValue} USD equals`;
    secPara.textContent = `${pkrValue.toFixed(2)} PKR`;
  } catch (err) {
    console.error(err);
    firstPara.textContent = "Conversion failed";
    secPara.textContent = "";
  }
});
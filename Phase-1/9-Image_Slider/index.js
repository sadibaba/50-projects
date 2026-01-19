const mainEl = document.querySelector('#main img');
const otherButtons = document.querySelectorAll('#other button');

otherButtons.forEach(button => {
  button.addEventListener('click', () => {
    const thumbImg = button.querySelector('img');
    const tempSrc = mainEl.src;
    mainEl.src = thumbImg.src;
    thumbImg.src = tempSrc;
  });
});
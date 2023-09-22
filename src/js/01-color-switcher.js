const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};
let setIntervalFn = null;

refs.startBtn.addEventListener('click', onStartChangeColor);
refs.stopBtn.addEventListener('click', onStopChangeColor);

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

function disableBtn(startBtnDisable, stopBtnDisable) {
  refs.startBtn.disabled = startBtnDisable;
  refs.stopBtn.disabled = stopBtnDisable;
}

function onStartChangeColor() {
  disableBtn(true, false);
  document.body.style.backgroundColor = getRandomHexColor();

  setIntervalFn = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function onStopChangeColor() {
  disableBtn(false, true);
  clearInterval(setIntervalFn);
}

import buttonsData from './buttons-data.js';

// const textArea = document.createElement('textarea');
// textArea.className = 'board__text-area';
//
// const boardContent = document.createElement('div');
// board.className = 'board__content'

const textArea = document.querySelector('.board__text-area');
const board = document.querySelector('.board__content');

function addText(target, textInput, isShiftKeyPressed) {
  if (isShiftKeyPressed) {
    textInput.value += target.firstElementChild.innerText;
  } else {
    const arrFromText = textArea.value.split('');
    const cursorPosition = textArea.selectionStart;
    arrFromText.splice(cursorPosition, 0, target.lastElementChild.innerText);
    textArea.value = arrFromText.join('');
    textArea.selectionStart = cursorPosition + 1;
    textArea.selectionEnd = textArea.selectionStart;
  }
}

let timer;
let interval;
board.onmousedown = (event) => {
  const { target } = event;
  if (target.tagName === 'BUTTON') {
    addText(target, textArea, event.shiftKey);
    timer = setTimeout(() => {
      interval = setInterval(() => addText(target, textArea, event.shiftKey), 50);
    }, 500);
  }
};

board.onmouseup = () => {
  clearTimeout(timer);
  clearInterval(interval);
  textArea.focus();
};

document.onkeydown = (event) => {
  textArea.focus();
  const { code, key, isTrusted } = event;
  if (isTrusted && key !== 'Alt' && key !== 'Control' && key !== 'Shift') {
    const buttonKey = document.getElementById(code);
    buttonKey.classList.add('active');
  }
};

document.onkeyup = (event) => {
  const { code, key } = event;
  if (key !== 'Alt' && key !== 'Control' && key !== 'Shift') {
    const buttonKey = document.getElementById(code);
    buttonKey.classList.remove('active');
  }
};

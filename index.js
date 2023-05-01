import buttonsData from './buttons-data.js';

const board = document.querySelector('.board');

const boardContent = document.createElement('div');
boardContent.className = 'board__content';

const textArea = document.createElement('textarea');
textArea.className = 'board__text-area';

board.append(textArea, boardContent);
board.append(boardContent);

let isCapslockPressed = false;
let language = localStorage.getItem('language') || 'en';

function createButtons() {
  boardContent.innerText = '';
  const arrFromButtonsData = Object.entries(buttonsData);
  for (let i = 0; i < arrFromButtonsData.length; i += 1) {
    const button = document.createElement('button');
    const keyObject = arrFromButtonsData[i][0];
    button.id = keyObject;
    const data = buttonsData[keyObject];
    button.className = `button-key ${data?.class || ''}`;
    if (data[language][1] && !keyObject.includes('Key')) {
      const spanUpName = document.createElement('span');
      spanUpName.className = 'button-key__up-name';
      spanUpName.innerText = buttonsData[keyObject][language][1];
      button.append(spanUpName);
    }
    const spanText = document.createElement('span');
    spanText.className = 'button-key__text';
    spanText.innerText = buttonsData[keyObject][language][0];
    button.append(spanText);
    boardContent.append(button);
  }
}

createButtons();

const buttonCapsLock = boardContent.querySelector('#CapsLock');

const description = document.createElement('div');
description.className = 'description';
description.innerText = 'Press Ctrl + Shift for changing language!\nKeyboard created foe Windows!';
board.append(description);

function addText(id, textInput, event) {
  const arrFromText = textArea.value.split('');
  const cursorPosition = textArea.selectionStart;
  const data = buttonsData[id];
  let isUpperCase;
  if (isCapslockPressed) {
    isUpperCase = !event.shiftKey;
  } else {
    isUpperCase = event.shiftKey;
  }
  if (isUpperCase) {
    arrFromText.splice(cursorPosition, 0, data.en[0]);
    textArea.value = arrFromText.join('');
  } else {
    arrFromText.splice(cursorPosition, 0, data.en[1]);
    textArea.value = arrFromText.join('');
  }
  textArea.selectionStart = cursorPosition + 1;
  textArea.selectionEnd = textArea.selectionStart;
}

function pressSpecialKey(target, textInput, specialKey) {
  const arrFromText = textArea.value.split('');
  const { selectionStart } = textArea;
  const { selectionEnd } = textArea;
  switch (specialKey) {
    case 'Delete':
      if (selectionStart === selectionEnd) {
        arrFromText.splice(selectionStart, 1);
        textInput.value = arrFromText.join('');
        textInput.selectionStart = selectionStart;
      } else {
        arrFromText.splice(selectionStart, selectionEnd - selectionStart);
        textInput.value = arrFromText.join('');
        textInput.selectionStart = selectionStart;
      }
      break;
    case 'Backspace':
      if (selectionStart === selectionEnd) {
        arrFromText.splice(selectionStart - 1, 1);
        textInput.value = arrFromText.join('');
        textInput.selectionStart = selectionStart - 1;
      } else {
        arrFromText.splice(selectionStart, selectionEnd - selectionStart);
        textInput.value = arrFromText.join('');
        textInput.selectionStart = selectionStart;
      }
      break;
    case 'Enter':
      if (selectionStart === selectionEnd) {
        arrFromText.splice(selectionStart, 0, '\n');
        textInput.value = arrFromText.join('');
        textInput.selectionStart = selectionStart + 1;
        textInput.selectionEnd = selectionStart + 1;
      } else {
        arrFromText.splice(selectionStart, selectionEnd - selectionStart, '\n');
        textInput.value = arrFromText.join('');
        textInput.selectionStart = selectionStart + 1;
        textInput.selectionEnd = selectionStart + 1;
      }
      break;
  }
  textInput.selectionEnd = textInput.selectionStart;
}

function toggleCapsLock() {
  isCapslockPressed = !isCapslockPressed;
  buttonCapsLock.classList.toggle('button-key_capslock');
  console.log(isCapslockPressed);
}

let timer;
let interval;
boardContent.onmousedown = (event) => {
  const { target } = event;
  if (target.tagName === 'BUTTON') {
    switch (target.id) {
      case 'Delete':
        pressSpecialKey(target, textArea, 'Delete');
        break;
      case 'Backspace':
        pressSpecialKey(target, textArea, 'Backspace');
        break;
      case 'Enter':
        pressSpecialKey(target, textArea, 'Enter');
        break;
      case 'CapsLock':
        toggleCapsLock(event);
        break;
      default:
        addText(target.id, textArea, event);
        timer = setTimeout(() => {
          interval = setInterval(() => addText(target.id, textArea, event), 50);
        }, 500);
    }
  }
};

boardContent.onmouseup = () => {
  clearTimeout(timer);
  clearInterval(interval);
  textArea.focus();
};

document.onkeydown = (event) => {
  textArea.focus();
  const { code } = event;
  if (code) {
    const buttonKey = document.getElementById(code);
    buttonKey.classList.add('active');
  }
  if (event.ctrlKey && event.shiftKey) {
    language = language === 'en' ? 'ru' : 'en';
    localStorage.setItem('language', language);
    createButtons();
  }
};

document.onkeyup = (event) => {
  const { code } = event;
  const buttonKey = document.getElementById(code);
  buttonKey.classList.remove('active');
};

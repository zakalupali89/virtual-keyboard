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
const buttonsElements = [];
function createButtons() {
  boardContent.innerText = '';
  const arrFromButtonsData = Object.entries(buttonsData);
  for (let i = 0; i < arrFromButtonsData.length; i += 1) {
    const button = document.createElement('button');
    buttonsElements.push(button);
    const keyObject = arrFromButtonsData[i][0];
    button.id = keyObject;
    const data = buttonsData[keyObject];
    button.className = `button-key ${data?.class || ''}`;
    if (data[language][1] && !keyObject.includes('Key')) {
      const spanUpName = document.createElement('span');
      spanUpName.className = 'button-key__up-name';
      const [, text] = buttonsData[keyObject][language];
      spanUpName.innerText = text;
      button.append(spanUpName);
    }
    const spanText = document.createElement('span');
    spanText.className = 'button-key__text';
    const [text] = buttonsData[keyObject][language];
    spanText.innerText = text;
    button.append(spanText);
    boardContent.append(button);
  }
}

createButtons();

function rerenderButton() {
  buttonsElements.forEach((item) => {
    const { id, firstElementChild, lastElementChild } = item;
    const data = buttonsData[item.id];
    if (data[language][1] && !id.includes('Key')) {
      const [, text] = buttonsData[id][language];
      firstElementChild.innerText = text;
    }
    const [text] = buttonsData[id][language];
    lastElementChild.innerText = text;
  });
}

const buttonCapsLock = boardContent.querySelector('#CapsLock');

const description = document.createElement('div');
description.className = 'description';
description.innerText = 'Press Ctrl + Shift for changing language!\nKeyboard created foe Windows!';
board.append(description);

function addText(id, textInput, event) {
  if (id === 'ShiftLeft' || id === 'ShiftRight' || id === 'AltLeft' || id === 'AltRight'
    || id === 'OsLeft' || id === 'Enter' || id === 'Backspace' || id === 'Delete'
    || id === 'CapsLock' || id.includes('Arrow')) {
    return;
  }
  const arrFromText = textArea.value.split('');
  const cursorPosition = textArea.selectionStart;
  const data = buttonsData?.[id];
  if (!data) {
    return;
  }
  let isUpperCase;
  if (isCapslockPressed || event.getModifierState('CapsLock')) {
    isUpperCase = !event.shiftKey;
  } else {
    isUpperCase = event.shiftKey;
  }
  if (isUpperCase) {
    arrFromText.splice(cursorPosition, 0, data[language][0]);
    textArea.value = arrFromText.join('');
  } else {
    arrFromText.splice(cursorPosition, 0, data[language][1]);
    textArea.value = arrFromText.join('');
  }
  textArea.selectionStart = cursorPosition + 1;
  textArea.selectionEnd = textArea.selectionStart;
}

function pressSpecialKey(textInput, specialKey) {
  const input = textInput;
  const arrFromText = textArea.value.split('');
  const { selectionStart } = textArea;
  const { selectionEnd } = textArea;
  switch (specialKey) {
    case 'Delete':
      if (selectionStart === selectionEnd) {
        arrFromText.splice(selectionStart, 1);
        input.value = arrFromText.join('');
        input.selectionStart = selectionStart;
      } else {
        arrFromText.splice(selectionStart, selectionEnd - selectionStart);
        input.value = arrFromText.join('');
        input.selectionStart = selectionStart;
      }
      break;
    case 'Backspace':
      if (selectionStart === selectionEnd) {
        arrFromText.splice(selectionStart - 1, 1);
        input.value = arrFromText.join('');
        input.selectionStart = selectionStart - 1;
      } else {
        arrFromText.splice(selectionStart, selectionEnd - selectionStart);
        input.value = arrFromText.join('');
        input.selectionStart = selectionStart;
      }
      break;
    case 'Enter':
      if (selectionStart === selectionEnd) {
        arrFromText.splice(selectionStart, 0, '\n');
        input.value = arrFromText.join('');
        input.selectionStart = selectionStart + 1;
        input.selectionEnd = selectionStart + 1;
      } else {
        arrFromText.splice(selectionStart, selectionEnd - selectionStart, '\n');
        input.value = arrFromText.join('');
        input.selectionStart = selectionStart + 1;
        input.selectionEnd = selectionStart + 1;
      }
      break;
    default:
      break;
  }
  input.selectionEnd = textInput.selectionStart;
}

function toggleCapsLock(event) {
  if (event) {
    if (event.getModifierState('CapsLock')) {
      isCapslockPressed = true;
      buttonCapsLock.classList.add('button-key_capslock');
    } else {
      isCapslockPressed = false;
      buttonCapsLock.classList.remove('button-key_capslock');
    }
  } else if (isCapslockPressed) {
    isCapslockPressed = false;
    buttonCapsLock.classList.remove('button-key_capslock');
  } else {
    isCapslockPressed = true;
    buttonCapsLock.classList.add('button-key_capslock');
  }
}

let timer;
let interval;
boardContent.onmousedown = (event) => {
  const { target } = event;
  if (target.tagName === 'BUTTON') {
    switch (target.id) {
      case 'Delete':
        pressSpecialKey(textArea, 'Delete');
        break;
      case 'Backspace':
        pressSpecialKey(textArea, 'Backspace');
        break;
      case 'Enter':
        pressSpecialKey(textArea, 'Enter');
        break;
      case 'CapsLock':
        toggleCapsLock();
        break;
      default:
        addText(target.id, textArea, event);
        timer = setTimeout(() => {
          interval = setInterval(() => addText(target.id, textArea, event), 50);
        }, 500);
    }
    if (target.id.includes('Arrow')) {
      const newEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const button = buttonsElements.filter((item) => item.id === target.id)[0];
      button.dispatchEvent(newEvent);
    }
  }
};

boardContent.onmouseup = () => {
  clearTimeout(timer);
  clearInterval(interval);
  textArea.focus();
};

document.onkeydown = (event) => {
  const { code } = event;
  if (!code.includes('Arrow')) {
    event.preventDefault();
  }
  textArea.focus();
  if (code === 'CapsLock') {
    toggleCapsLock(event);
  }

  if (code) {
    const buttonKey = document.getElementById(code);
    buttonKey.classList.add('active');
  }
  if (event.ctrlKey && event.shiftKey) {
    language = language === 'en' ? 'ru' : 'en';
    localStorage.setItem('language', language);
    rerenderButton();
  } else {
    addText(event.code, textArea, event);
    pressSpecialKey(textArea, event.code);
  }
};

document.onkeyup = (event) => {
  const { code } = event;
  const buttonKey = document.getElementById(code);
  buttonKey.classList.remove('active');
};

import buttonsData from './buttons-data.js';

const board = document.querySelector('.board');

const boardContent = document.createElement('div');
boardContent.className = 'board__content';

const textArea = document.createElement('textarea');
textArea.className = 'board__text-area';

board.append(textArea, boardContent);
board.append(boardContent);

const arrFromButtonsData = Object.entries(buttonsData);
for (let i = 0; i < 65; i += 1) {
  const button = document.createElement('button');
  const keyObject = arrFromButtonsData[i][0];
  button.id = keyObject;
  const data = buttonsData[keyObject];
  button.className = `button-key ${data?.class || ''}`;
  if (data.en[1] && !keyObject.includes('Key')) {
    const spanUpName = document.createElement('span');
    spanUpName.className = 'button-key__up-name';
    spanUpName.innerText = buttonsData[keyObject].en[1];
    button.append(spanUpName);
  }
  const spanText = document.createElement('span');
  spanText.className = 'button-key__text';
  spanText.innerText = buttonsData[keyObject].en[0];
  button.append(spanText);
  boardContent.append(button);
}

const description = document.createElement('div');
description.className = 'description';
description.innerText = 'Press Ctrl + Shift for changing language!';
board.append(description);

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

function deleteChar(target, textInput, direction) {
  const arrFromText = textArea.value.split('');
  const { selectionStart } = textArea;
  const { selectionEnd } = textArea;
  if (direction === 'delete') {
    if (selectionStart === selectionEnd) {
      arrFromText.splice(selectionStart, 1);
      textInput.value = arrFromText.join('');
      textInput.selectionStart = selectionStart;
    } else {
      arrFromText.splice(selectionStart, selectionEnd - selectionStart);
      textInput.value = arrFromText.join('');
      textInput.selectionStart = selectionStart;
    }
  } else if (selectionStart === selectionEnd) {
    arrFromText.splice(selectionStart - 1, 1);
    textInput.value = arrFromText.join('');
    textInput.selectionStart = selectionStart - 1;
  } else {
    arrFromText.splice(selectionStart, selectionEnd - selectionStart);
    textInput.value = arrFromText.join('');
    textInput.selectionStart = selectionStart;
  }
  textInput.selectionEnd = textInput.selectionStart;
}

function newLine(target, textInput) {
  const arrFromText = textArea.value.split('');
  const { selectionStart } = textArea;
  const { selectionEnd } = textArea;
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
}

let timer;
let interval;
boardContent.onmousedown = (event) => {
  const { target } = event;
  console.log(event.getModifierState('CapsLock'));
  if (target.tagName === 'BUTTON') {
    switch (target.id) {
      case 'Delete': {
        deleteChar(target, textArea, 'delete');
        break;
      }
      case 'Backspace': {
        deleteChar(target, textArea, 'backspace');
        break;
      }
      case 'Enter': {
        newLine(target, textArea);
        break;
      }
      default: {
        addText(target, textArea, event.shiftKey);
        timer = setTimeout(() => {
          interval = setInterval(() => addText(target, textArea, event.shiftKey), 50);
        }, 500);
      }
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
  const { code, key } = event;
  console.log(code, key);
  const buttonKey = document.getElementById(code);
  buttonKey.classList.add('active');
};

document.onkeyup = (event) => {
  const { code } = event;
  const buttonKey = document.getElementById(code);
  buttonKey.classList.remove('active');
};


const previousDisplay = document.getElementById('previous');
const currentDisplay = document.getElementById('current');

let currentOperand = '';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentDisplay.textContent = currentOperand || '0';
  previousDisplay.textContent = previousOperand + (operation || '0');
}

function appendNumber(number) {
  if (number === '.' && currentOperand.includes('.')) return;
  if(shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false; //есть число
  }
  currentOperand += number;
  updateDisplay();
}

function chooseOperation(op) {
  if(currentOperand === '' && previousOperand === '') return;
  if (currentOperand === '') {
    operation = op;
    updateDisplay();
    return;
  }
  if(previousOperand !== '') {
    compute();
  }
  previousOperand = currentOperand;
  operation = op;
  currentOperand = '';
  updateDisplay();
}

function compute() {
  let result;
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;
  switch (operation) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '*':
        result = prev * curr;
        break;
      case '/':
        if (curr === 0) {
          result = 'Ошибка';
        } else {
          result = prev / curr;
        }
        break;
      default:
        return;
    }
    currentOperand = result.toString();
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function clearAll() {
  currentOperand = '';
  previousOperand = '';
  operation = null;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetScreen) return; //нет числа из-за этого возвращаем, так как там пусто
  currentOperand = currentOperand.slice(0, -1);
  updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  const value = button.dataset.value;

  if (button.classList.contains('number')) {
    appendNumber(value);
    return;
  }

  if (button.classList.contains('operator')) {
    chooseOperation(value);
    return;
  }

  if (button.id === 'clear') {
    clearAll();
    return;
  }

  if (button.id === 'delete') {
    deleteLast();
    return;
  }

  if (button.id === 'equals') {
    compute();
    return;
  }
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key >= '0' && key <= '9' || key === '.') {
    const button = document.querySelector(`.number[data-value="${key}"]`);
    if (button) button.click();
    return;
  }

  if (key === '+' || key === '-' || key === '*' || key === '/') {
    const button = document.querySelector(`.operator[data-value="${key}"]`);
    if (button) button.click();
    return;
  }

  if (key === 'Enter' || key === '=') {
    document.getElementById('equals').click();
    return;
  }

  if (key === 'Backspace') {
    document.getElementById('delete').click();
    return;
  }

  if (key === 'Escape') {
    document.getElementById('clear').click();
    return;
  }
});

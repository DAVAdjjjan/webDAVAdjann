'use strict';

//#region task1
const swapVarLogo = document.querySelector('.header__logo');
const swapVarIcon = document.querySelector('.menu__icon');

const photoSwapper = function () {
  [swapVarLogo.src, swapVarIcon.src] = [swapVarIcon.src, swapVarLogo.src];

  [swapVarLogo.className, swapVarIcon.className] = [
    swapVarIcon.className,
    swapVarLogo.className,
  ];

  swapVarLogo.style.height = swapVarLogo.src.includes('img/header__logo.png')
    ? '15vh'
    : '2.7vh';
};

swapVarLogo.addEventListener('click', photoSwapper);
//#endregion

//#region tak2
function validateNumberInput(promptText, min, max) {
  let input;
  while (true) {
    input = prompt(promptText);
    if (input === null) {
      alert('Input canceled.');
      return null;
    }
    input = Number(input);
    if (Number.isInteger(input) && input >= min && input <= max) {
      return input;
    }
    alert(`Please enter an integer between ${min} and ${max}.`);
  }
}

const leftBarRec = document.querySelector('#compute_area');

leftBarRec.addEventListener('click', function () {
  const sideA = validateNumberInput(
    'Input the number of rows of stands (1-100):',
    1,
    100
  );
  if (sideA === null) return;

  const sideB = validateNumberInput(
    'Input the number of columns of stands (1-100):',
    1,
    100
  );
  if (sideB === null) return;

  const area = sideA * sideB;
  document.querySelector('.area').textContent = area;
});
//#endregion

//#region task3
const minMax = document.querySelector('#min_max');

minMax.addEventListener('click', function () {
  const valueHolder = [];
  for (let i = 0; i < 10; i++) {
    const element = validateNumberInput(
      `Input integer number ${i + 1} (range: from -100 to 100)`,
      -100,
      100
    );
    if (element === null) return;
    valueHolder.push(element);
  }
  const min = Math.min(...valueHolder);
  const max = Math.max(...valueHolder);

  document.cookie = `minValue=${min}; path=/; max-age=3600`;
  document.cookie = `maxValue=${max}; path=/; max-age=3600`;

  alert(`The minimum value is: ${min}. The maximum value is: ${max}`);
  minMax.style.display = 'none';
});

const getCookie = function (name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return undefined;
};

const deleteCookie = function (name) {
  document.cookie = `${name}=; path=/; max-age=0`;
};

const handleCookies = function () {
  const minValue = getCookie('minValue');
  const maxValue = getCookie('maxValue');

  if (minValue !== undefined && maxValue !== undefined) {
    const userChoice = confirm(
      `Cookies found:\nMin Value: ${minValue}\nMax Value: ${maxValue}\n
      Do you want to keep this data?`
    );

    if (userChoice) {
      alert('Cookies are kept.');
      minMax.style.display = 'none';
    } else {
      deleteCookie('minValue');
      deleteCookie('maxValue');
      location.reload();
    }
  } else {
    minMax.style.display = 'block';
  }
};

window.addEventListener('load', handleCookies);
//#endregion

//#region task4
const boldCheckbox = document.querySelector('.checkbox');
const rightBar = document.querySelector('.right__bar');

let isTextBold = false;

const applyBoldness = function (fontWeight) {
  const elements = rightBar.querySelectorAll('*');

  for (let element of elements) {
    element.style.fontWeight = fontWeight;
  }
};

const updateBoldness = function () {
  const isChecked = boldCheckbox.checked;
  const isFocused = document.activeElement === rightBar;

  if (isChecked && isFocused) {
    applyBoldness('bold');
    isTextBold = true;
  } else {
    applyBoldness('normal');
    isTextBold = false;
  }

  localStorage.setItem('block5Bold', isChecked ? 'bold' : 'normal');
  localStorage.setItem('isTextBold', isTextBold);
};

window.addEventListener('load', function () {
  boldCheckbox.checked = localStorage.getItem('block5Bold') === 'bold';

  isTextBold = localStorage.getItem('isTextBold') === 'true';

  applyBoldness(isTextBold ? 'bold' : 'normal');
});

boldCheckbox.addEventListener('change', updateBoldness);
rightBar.addEventListener('focus', updateBoldness);
rightBar.addEventListener('blur', updateBoldness);
//#endregion

//#region task5
const tableForm = document.querySelector('.tableForm');
const clearTableButton = document.querySelector('.clearTableButton');
const dynamicTable = document.querySelector('.dynamicTable');

//------------------------- table storage------------------//
function saveTable() {
  const rows = [];
  const tableRows = dynamicTable.querySelectorAll('tr');

  for (let i = 0; i < tableRows.length; i++) {
    const cell = tableRows[i].querySelector('td');
    if (cell) {
      rows.push(cell.textContent);
    }
  }

  localStorage.setItem('dynamicTableData', JSON.stringify(rows));
}

function loadTable() {
  const data = localStorage.getItem('dynamicTableData');
  if (data) {
    const rows = JSON.parse(data);

    for (let i = 0; i < rows.length; i++) {
      const newRow = dynamicTable.insertRow();
      const newCell = newRow.insertCell(0);
      newCell.textContent = rows[i];
      addCellListener(newCell);
    }
  }
}
//------------------------- table storage------------------//

//------------------------edit cell-------------------------//
function addCellListener(cell) {
  cell.addEventListener('click', function (e) {
    e.stopPropagation();
    const currentCell = this;
    const currentValue = currentCell.textContent;

    if (currentCell.querySelector('input')) {
      return;
    }

    const editContainer = document.createElement('div');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentValue;

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';

    currentCell.textContent = '';
    editContainer.appendChild(inputField);
    editContainer.appendChild(saveButton);

    currentCell.appendChild(editContainer);

    inputField.focus();

    const handleClickOutside = function (e) {
      if (!currentCell.contains(e.target)) {
        currentCell.textContent = currentValue;
        document.removeEventListener('click', handleClickOutside);
      }
    };

    saveButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentCell.textContent = inputField.value;
      saveTable();
      document.removeEventListener('click', handleClickOutside);
    });

    document.addEventListener('click', handleClickOutside);
  });
}
//------------------------edit cell-------------------------//

//---------------------- add row--------------------------------//
tableForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputValue = document.querySelector('#newRowValue').value.trim();
  if (inputValue === '') return;

  const newRow = dynamicTable.insertRow();
  const newCell = newRow.insertCell(0);
  newCell.textContent = inputValue;

  addCellListener(newCell);

  document.querySelector('#newRowValue').value = '';

  saveTable();
});
//---------------------- clear table--------------------------------//

clearTableButton.addEventListener('click', function () {
  dynamicTable.innerHTML = '';
  localStorage.removeItem('dynamicTableData');
});

document.addEventListener('DOMContentLoaded', loadTable);
//#endregion

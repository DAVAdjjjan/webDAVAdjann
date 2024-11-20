"use strict";

//#region task1
const swapVarLogo = document.querySelector(".header__logo");
const swapVarIcon = document.querySelector(".menu__icon");

const photoSwapper = function () {
  [swapVarLogo.src, swapVarIcon.src] = [swapVarIcon.src, swapVarLogo.src];

  [swapVarLogo.className, swapVarIcon.className] = [
    swapVarIcon.className,
    swapVarLogo.className,
  ];

  swapVarLogo.style.height = swapVarLogo.src.includes("img/header__logo.png")
    ? "15vh"
    : "2.7vh";
};

swapVarLogo.addEventListener("click", photoSwapper);
//#endregion

//#region tak2
function validateNumberInput(promptText, min, max) {
  let input;
  while (true) {
    input = prompt(promptText);
    if (input === null) {
      alert("Input canceled.");
      return null;
    }
    input = Number(input);
    if (Number.isInteger(input) && input >= min && input <= max) {
      return input;
    }
    alert(`Please enter an integer between ${min} and ${max}.`);
  }
}

const leftBarRec = document.querySelector("#compute_area");

leftBarRec.addEventListener("click", function () {
  const sideA = validateNumberInput(
    "Input the number of rows of stands (1-100):",
    1,
    100
  );
  if (sideA === null) return;

  const sideB = validateNumberInput(
    "Input the number of columns of stands (1-100):",
    1,
    100
  );
  if (sideB === null) return;

  const area = sideA * sideB;
  document.querySelector(".area").textContent = area;
});
//#endregion

//#region task3
const minMax = document.querySelector("#min_max");

minMax.addEventListener("click", function () {
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
  minMax.style.display = "none";
});

const getCookie = function (name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return undefined;
};

const deleteCookie = function (name) {
  document.cookie = `${name}=; path=/; max-age=0`;
};

const handleCookies = function () {
  const minValue = getCookie("minValue");
  const maxValue = getCookie("maxValue");

  if (minValue !== undefined && maxValue !== undefined) {
    const userChoice = confirm(
      `Cookies found:\nMin Value: ${minValue}\nMax Value: ${maxValue}\n
      Do you want to keep this data?`
    );

    if (userChoice) {
      alert("Cookies are kept.");
      minMax.style.display = "none";
    } else {
      deleteCookie("minValue");
      deleteCookie("maxValue");
      location.reload();
    }
  } else {
    alert("No cookies found. Initial state is loaded.");
    minMax.style.display = "block";
  }
};

window.addEventListener("load", handleCookies);

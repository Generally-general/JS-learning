const buttons = document.querySelectorAll("button");

const result = document.getElementById("result");

const operators = ['+', '-', '*', '/'];

for(let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    const buttonValue = (buttons[i].textContent);

    if(buttonValue === "C") {
      clearResult();
    } else if(buttonValue === "CE") {
      clearOne();
    } else if(buttonValue === "=") {
      calculateResult();
    } else {
      appendValue(buttonValue);
    }
  })
}

const clearResult = () => {
  result.value = "";
}

const clearOne = () => {
  result.value = result.value.slice(0, -1);
}

const calculateResult = () => {
  result.value = eval(result.value);
}

const appendValue = (value) => {
  const lastChar = result.value.slice(-1);
  if(operators.includes(value) && operators.includes(lastChar)) {
    result.value = "Error";
    setTimeout(() => result.value = "", 1000);
    return;
  }
  result.value += value;
}
const rollDice = document.getElementById("roll-button");
const dice = document.getElementById("dice");
const rollHistory = document.getElementById("roll-history");

let roll = 1;
const diceValues = {
  1: "&#9856",
  2: "&#9857",
  3: "&#9858",
  4: "&#9859",
  5: "&#9860",
  6: "&#9861",
}

const updateHistory = (num) => {
  const newItem = document.createElement("li");
  newItem.innerHTML = `Roll ${roll}: <span>${diceValues[num]}</span>`;
  roll++;
  rollHistory.appendChild(newItem);
}

function triggerDiceAnimation() {
  dice.classList.add("roll-animation");
  setTimeout(() => dice.classList.remove("roll-animation"), 1000);
}

function getRandomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}

rollDice.addEventListener('click', () => {
  let randomNumber = getRandomDiceValue();
  triggerDiceAnimation();
  dice.innerHTML = diceValues[randomNumber];
  updateHistory(randomNumber);
})




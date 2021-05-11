import pTable from "ptable";
import images from "./assets/img/elements-img/*.png";

const inputFormula = document.querySelector(".formula-intro");
const btnCalc = document.querySelector(".calc-btn");
const containerIntro = document.querySelector(".intro-div");
const showCalcContainer = document.querySelector(".show-calc");
const elementTableCounter = document.querySelector("table");

const parseFormula = () => {
  const value = inputFormula.value;
  value.length !== 0 ? renderView(atomicCounter(value)) : console.log("Error");
  inputFormula.value = "";
};

const LOWER_CASE_LETTER = /^[a-z]*$/;
const concatArray = (arr) => {
  const newArr = [];
  let ii = 0;
  for (const [i, e] of arr.entries()) {
    if (LOWER_CASE_LETTER.test(e)) {
      newArr[i - 1] = arr[i - 1].concat(e);
    }
    //fix concat numbers from array
    if (/\d+/g.test(e)) {
      if (i - ii === 1) {
        console.log(i, e);
        newArr[i - 1] = arr[i - 1].concat(e);
      }
      ii = i;
    }
    newArr.push(e);
  }
  return newArr.filter((x) => !LOWER_CASE_LETTER.test(x));
};

const renderView = (obj) => {
  const { formulaCounter, formulaCounterN } = obj;

  const gridCol = document.createElement("div");
  const hElement = document.createElement("p");
  const nodeText = document.createTextNode(inputFormula.value);

  gridCol.className = "col span-3-of-3";
  hElement.className = "formula-sample";
  hElement.appendChild(nodeText);
  gridCol.appendChild(hElement);
  containerIntro.appendChild(gridCol);

  for (let index = 0; index < formulaCounter.length; index++) {
    const { name, number } = pTable(formulaCounter[index]);
    elementTableCounter.insertRow().innerHTML = `
    <td><h3 class="amount-element">${formulaCounterN[index]}</h3></td>
    <td><h3>of</h3></td>
    <td>
      <img
        class="element-image"
        src="${images[`${number}-${name}-Tile`]}"
        alt="Element Image"
      />
    </td>`;
  }
};

const atomicCounter = function (formula = "Mg5H4(O2)H4MgO5Li5HH") {
  const LETTER = /^[a-zA-Z]*$/;

  const NUMBER = /\d+/g;
  const OPEN_PAR = "(";
  const CLOSE_PAR = ")";

  const Formula = concatArray(formula.split(""));
  const formulaCounterN = [];

  const formulaCounter = [];
  const [l] = Formula[0];
  let i = 0;
  try {
    if (!LETTER.test(l))
      throw new Error("Your formula need to start with a CAPITAL letter");

    for (const [index, element] of Formula.entries()) {
      if (LETTER.test(element)) {
        if (index - i === 1) {
          formulaCounterN[formulaCounter.indexOf(Formula[index - 1])]++;
        }
        i = index;
        if (!formulaCounter.includes(element)) {
          formulaCounter.push(element);
          formulaCounterN.push(0);
        }
      }
      if (NUMBER.test(element)) {
        formulaCounterN[
          formulaCounter.indexOf(Formula[Formula.indexOf(element) - 1])
        ] += Number(element);

        Formula[Formula.indexOf(element)] =
          +Formula[Formula.indexOf(element)].concat("*");
      }
    }
    if (
      LETTER.test(Formula[Formula.length - 1]) &&
      typeof Formula[Formula.length - 1] !== "number"
    ) {
      formulaCounterN[formulaCounter.indexOf(Formula[Formula.length - 1])]++;
    }
    return { formulaCounter, formulaCounterN };
  } catch (error) {
    console.log(error);
  }
};
btnCalc.addEventListener("click", parseFormula);

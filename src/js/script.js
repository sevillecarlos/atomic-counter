import pTable from "ptable";
import images from "../../assets/img/elements-img/*.png";
import {
  LETTER,
  OPEN_PAR,
  CLOSE_PAR,
  OPEN_BRA,
  CLOSE_BRA,
  NUMBER,
  LOWER_CASE_LETTER,
} from "./config";
import {
  parseNumber,
  concatArray,
  removeParaValues,
  removeBraValues,
  addOneToLetter,
} from "./helper";
/*************************************************************************************************************/
const inputFormula = document.querySelector(".formula-intro");
const btnCalc = document.querySelector(".calc-btn");
const elementTableCounter = document.querySelector("table");
const errorTag = document.querySelector(".error-tag");
errorTag.textContent = "";
/*************************************************************************************************************/
let numberToMultiply = 1;
const parse = () => {
  errorTag.textContent = "";
  const value = inputFormula.value;
  LOWER_CASE_LETTER.test(value[0]) && value.length !== 0
    ? (errorTag.textContent = `☠️ The formula need to start with a CAPITAL letter`)
    : value.length !== 0
    ? renderView(atomicCounter(value))
    : (errorTag.textContent = "⚠️ Not have formula to calculate");
  inputFormula.value = "";
};

const clear = () => {
  elementTableCounter.innerHTML = "";
};

const renderView = (obj) => {
  const { formulaCounter, formulaCounterN } = obj;
  clear();
  for (let index = 0; index < formulaCounter.length; index++) {
    const element = pTable(formulaCounter[index]);
    if (!element) {
      errorTag.textContent = `☠️ Some element of the formula don't exist`;
      break;
    }
    const { name, number } = element;
    if (errorTag.textContent === "" && element) {
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
  }
};

const parseFormula = (formula, formulaCounter, formulaCounterN) => {
  const subFormula = removeBraValues(
    removeParaValues(concatArray(parseNumber(formula)))
  );
  addOneToLetter(subFormula);
  for (const element of subFormula) {
    if (LETTER.test(element) || OPEN_PAR === element) {
      if (!formulaCounter.includes(element)) {
        if (!(OPEN_PAR === element) && !(CLOSE_PAR === element)) {
          formulaCounter.push(element);
          formulaCounterN.push(0);
        }
      }
    }
    if (NUMBER.test(element)) {
      formulaCounterN[
        formulaCounter.indexOf(subFormula[subFormula.indexOf(element) - 1])
      ] += Number(element);

      subFormula[subFormula.indexOf(element)] = -1;
    }
  }
};

const parseParanthesisFormula = (formula, formulaCounter, formulaCounterN) => {
  const Formula = concatArray(parseNumber(formula));
  const tempFormula = Formula;
  let i = 0;
  let indexOpen = 0;
  let indexClose = 0;

  for (const [index, element] of Formula.entries()) {
    if (OPEN_PAR === element) {
      indexOpen = index;
    }

    if (CLOSE_PAR === element) {
      indexClose = index;

      const subFormula = tempFormula.slice(indexOpen, indexClose + 1);
      const numberMultiply = tempFormula[indexClose + 1] * numberToMultiply;
      console.log("()", numberToMultiply, numberMultiply);
      if (numberMultiply) {
        for (const [index, element] of subFormula.entries()) {
          if (
            LETTER.test(element) ||
            OPEN_PAR === element ||
            CLOSE_PAR === element
          ) {
            if (!formulaCounter.includes(element)) {
              if (!(OPEN_PAR === element) && !(CLOSE_PAR === element)) {
                formulaCounter.push(element);
                formulaCounterN.push(0);
              }
            }
            if (index - i === 1) {
              if (formulaCounter.indexOf(subFormula[index - 1]) !== -1) {
                formulaCounterN[
                  formulaCounter.indexOf(subFormula[index - 1])
                ] += 1 * numberMultiply;
              }
            }
            i = index;
          }
          if (NUMBER.test(element)) {
            formulaCounterN[
              formulaCounter.indexOf(
                subFormula[subFormula.indexOf(element) - 1]
              )
            ] += Number(element) * numberMultiply;
            if (subFormula.indexOf(element)) {
              subFormula[subFormula.indexOf(element)] = -1;
            }
          }
        }
      } else {
        errorTag.textContent =
          "⚠️ Don't have number to multiply to ( ) or [ ], please removed";
        console.log("()");
      }
    }
  }
};

const parseBracketFormula = (formula, formulaCounter, formulaCounterN) => {
  const Formula = removeParaValues(concatArray(parseNumber(formula)));
  console.log(inputFormula.value);
  const tempFormula = Formula;
  let i = 0;
  let indexOpen = 0;
  let indexClose = 0;

  for (const [index, element] of Formula.entries()) {
    if (OPEN_BRA === element) {
      indexOpen = index;
    }

    if (CLOSE_BRA === element) {
      indexClose = index;

      const subFormula = tempFormula.slice(indexOpen, indexClose + 1);
      const numberMultiply = tempFormula[indexClose + 1];
      numberToMultiply = numberMultiply;
      console.log("[]", numberToMultiply, numberMultiply);
      if (!numberToMultiply) {
        numberToMultiply = 1;
      }
      if (numberMultiply) {
        for (const [index, element] of subFormula.entries()) {
          if (
            LETTER.test(element) ||
            OPEN_BRA === element ||
            CLOSE_BRA === element
          ) {
            if (!formulaCounter.includes(element)) {
              if (!(OPEN_BRA === element) && !(CLOSE_BRA === element)) {
                formulaCounter.push(element);
                formulaCounterN.push(0);
              }
            }
            if (index - i === 1) {
              if (formulaCounter.indexOf(subFormula[index - 1]) !== -1) {
                formulaCounterN[
                  formulaCounter.indexOf(subFormula[index - 1])
                ] += 1 * numberMultiply;
              }
            }
            i = index;
          }
          if (NUMBER.test(element)) {
            formulaCounterN[
              formulaCounter.indexOf(
                subFormula[subFormula.indexOf(element) - 1]
              )
            ] += Number(element) * numberMultiply;
            if (subFormula.indexOf(element)) {
              subFormula[subFormula.indexOf(element)] = -1;
            }
          }
        }
      } else {
        errorTag.textContent =
          "⚠️ Don't have number to multiply to ( ) or [ ], please removed";
        console.log("[]");
      }
    }
  }
};

const atomicCounter = function (
  formula = "K4ONNSO334K[Na(OK)2]34K4ONNSO334K[Na(OK)2]34"
) {
  const formulaCounterN = [];
  const formulaCounter = [];

  try {
    parseFormula(formula, formulaCounter, formulaCounterN);
    parseBracketFormula(formula, formulaCounter, formulaCounterN);
    parseParanthesisFormula(formula, formulaCounter, formulaCounterN);

    return { formulaCounter, formulaCounterN };
  } catch (error) {
    console.log(error);
  }
};
/*************************************************************************************************************/
btnCalc.addEventListener("click", parse);

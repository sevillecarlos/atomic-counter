import pTable from "ptable";
import images from "../../assets/img/elements-img/*.png";
import {
  LETTER,
  OPEN_PAR,
  CLOSE_PAR,
  OPEN_BRA,
  CLOSE_BRA,
  NUMBER,
} from "./config";
import {
  parseNumber,
  concatArray,
  removeParaValues,
  addOneToLetter,
} from "./helper";
/*************************************************************************************************************/
const inputFormula = document.querySelector(".formula-intro");
const btnCalc = document.querySelector(".calc-btn");
const elementTableCounter = document.querySelector("table");
const formulaSample = document.querySelector(".formula-sample");
/*************************************************************************************************************/
const parse = () => {
  const value = inputFormula.value;
  value.length !== 0 ? renderView(atomicCounter(value)) : console.log("Error");
  inputFormula.value = "";
};

const clear = () => {
  elementTableCounter.innerHTML = "";
  formulaSample.textContent = "";
};

const renderView = (obj) => {
  const { formulaCounter, formulaCounterN } = obj;
  clear();
  formulaSample.textContent = inputFormula.value;
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

const parseFormula = (formula, formulaCounter, formulaCounterN) => {
  const subFormula = removeParaValues(concatArray(parseNumber(formula)));
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
      const numberMultiply = tempFormula[indexClose + 1];

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
        console.log("If you dont a number to mult, remove para");
      }
    }
  }
};

// const parseBracketFormula=(formula, formulaCounter, formulaCounterN)=>{

// }

const atomicCounter = function (formula = "KKKK") {
  const formulaCounterN = [];
  const formulaCounter = [];
  try {
    console.log(formula);
    parseParanthesisFormula(formula, formulaCounter, formulaCounterN);
    parseFormula(formula, formulaCounter, formulaCounterN);

    return { formulaCounter, formulaCounterN };
  } catch (error) {
    console.log(error);
  }
};
/*************************************************************************************************************/
btnCalc.addEventListener("click", parse);

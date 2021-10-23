import pTable from "ptable";
import images from "../../assets/img/elements-img/*.png";
import arrowImage from "../../assets/img/rightarrow.png";
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
const tableContainer = document.querySelector(".container-counter-elements");
const enterFormula = document.querySelector(".enter-formula");
errorTag.textContent = "";
tableContainer.setAttribute("class", "containerTable");

/*************************************************************************************************************/
const parse = (e) => {
  e.preventDefault();
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
  const inexistentElements = [];
  clear();
  for (let index = 0; index < formulaCounter.length; index++) {
    const elementFormula = formulaCounter[index];
    const element = pTable(elementFormula);
    try {
      const { name, number } = element;
      if (errorTag.textContent === "" && element) {
        tableContainer.removeAttribute("class");
        elementTableCounter.insertRow().innerHTML = `
          <td><span class="amount-element">${formulaCounterN[index]}</span></td>
          <td><img
          class="arrow-image"
          src="${arrowImage}"
          alt="Element Image"
        /></td>
          <td>
            <img
              class="element-image"
              src="${images[`${number}-${name}-Tile`]}"
              alt="Element Image"
            />
          </td>`;
      }
    } catch (error) {
      inexistentElements.push(elementFormula);
    }
  }

  if (inexistentElements.length !== 0) {
    errorTag.textContent = `☠️ The element${
      inexistentElements.length !== 1 ? "s" : ""
    }  ${inexistentElements.join(", ")} don\'t exist`;
  }
};


const atomicCounter = function (
  formula = "K4ONNSO334K[Na(OK)2]34K4ONNSO334K[Na(OK)2]34"
) {
  enterFormula.textContent = inputFormula.value;
  try {
    parseFormula(formula);
    parseBracketFormula(formula, formulaCounter, formulaCounterN);
    parseParanthesisFormula(formula, formulaCounter, formulaCounterN);
    return { formulaCounter, formulaCounterN };
  } catch (error) {
    console.log(error);
  }
};
/*************************************************************************************************************/
btnCalc.addEventListener("click", (e) => parse(e));

import pTable from "ptable";
import images from "./assets/img/elements-img/*.png";

const inputFormula = document.querySelector(".formula-intro");
const btnCalc = document.querySelector(".calc-btn");
const containerIntro = document.querySelector(".intro-div");
const showCalcContainer = document.querySelector(".show-calc");
const elementTableCounter = document.querySelector("table");
const formulaSample = document.querySelector(".formula-sample");

const parseFormula = () => {
  const value = inputFormula.value;
  value.length !== 0 ? renderView(atomicCounter(value)) : console.log("Error");
  inputFormula.value = "";
};

const clear = () => {
  elementTableCounter.innerHTML = "";
  formulaSample.textContent = "";
};

const LOWER_CASE_LETTER = /^[a-z]*$/;

function processText(inputText) {
  var output = [];
  var json = inputText.split(" ");
  json.forEach(function (item) {
    output.push(item.replace(/\'/g, "").split(/(\d+)/).filter(Boolean));
  });
  return output.flat();
}

const convertNumber = (arr) => arr.map((x) => (parseInt(x) ? parseInt(x) : x));

const concatArray = (arr) => {
  const convertArr = convertNumber(arr);
  const newArr = convertArr
    .map((x, i, arr) => {
      if (!parseInt(x)) {
        if (x.length > 1) {
          if (!LOWER_CASE_LETTER.test(x[x.length - 1])) {
            return x.split("");
          } else {
            return x.split("");
          }
        }
      }
      return x;
    })
    .flat();
  const s = [];
  for (const [i, v] of newArr.entries()) {
    if (LOWER_CASE_LETTER.test(v)) {
      s[i - 1] = newArr[i - 1].concat(v);
    }
    s.push(v);
  }
  return s.filter((x) => !LOWER_CASE_LETTER.test(x));
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

const atomicCounter = function (formula = "Mg5H4(O2)H4MgO5Li5HH") {
  const LETTER = /^[a-zA-Z]*$/;

  const NUMBER = /\d+/g;
  const OPEN_PAR = "(";
  const CLOSE_PAR = ")";

  const Formula = concatArray(processText(formula));
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
        ] += element;

        Formula[Formula.indexOf(element)] = -1;
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

const inputFormula = document.querySelector(".formula-intro");
const btnCalc = document.querySelector(".calc-btn");
const showCalcContainer = document.querySelector(".show-calc");

const parseFormula = () => {
  const value = inputFormula.value;
  value.length !== 0 ? atomicCounter(value) : console.log("Error");
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
    if(/\d+/g.test(e)){
      if((i - ii) === 1){
        console.log(i,e)
        newArr[i - 1] = arr[i - 1].concat(e);
      }
      ii = i;
    }
    newArr.push(e);
  }
  return newArr.filter((x) => !LOWER_CASE_LETTER.test(x));
};

const atomicCounter = function (formula = "Mg5H4(O2)H4MgKaO5Li5H") {
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

        Formula[Formula.indexOf(element)] = +Formula[
          Formula.indexOf(element)
        ].concat("*");
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

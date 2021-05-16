import {
    LOWER_CASE_LETTER,
    LETTER,
    OPEN_PAR,
    CLOSE_PAR,
    OPEN_BRA,
    CLOSE_BRA,
    NUMBER,
  } from "./config";
/*************************************************************************************************************/
export const parseNumber = (inputText) => {
  const output = [];
  const arr = inputText.split(" ");
  arr.forEach(function (item) {
    output.push(item.replace(/\'/g, "").split(/(\d+)/).filter(Boolean));
  });
  return output.flat();
};
/*************************************************************************************************************/
const convertNumber = (arr) => arr.map((x) => (NUMBER.test(x) ? Number(x) : x));
/*************************************************************************************************************/
export const concatArray = (arr) => {
  const convertArr = convertNumber(arr);
  const tempArr = [];

  const newArr = convertArr
    .map((el) => {
      if (!NUMBER.test(el)) {
        if (el.length > 1) {
          return el.split("");
        }
      }
      return el;
    })
    .flat();

  for (const [i, v] of newArr.entries()) {
    if (LOWER_CASE_LETTER.test(v)) {
      tempArr[i - 1] = newArr[i - 1].concat(v);
    }
    tempArr.push(v);
  }
  //clean all small letters
  return tempArr.filter((x) => !LOWER_CASE_LETTER.test(x));
};
/*************************************************************************************************************/
//add lit 1 to the element real value
export const removeParaValues = (ar) => {
  let indexClosePara = 0;
  for (const [index, values] of ar.entries()) {
    if (CLOSE_PAR === values) {
      indexClosePara = index;
      if (parseInt(ar[indexClosePara + 1])) {
        ar.splice(indexClosePara + 1, 1);
      }
    }
  }
  return concatArray(parseNumber(ar.join("").replace(/\(([^()]+)\)/g, "")));
};
/*************************************************************************************************************/
export const addOneToLetter = (arr) => {
  for (const [index, value] of arr.entries()) {
    LETTER.test(value) &&
      !parseInt(arr[index + 1]) &&
      arr.splice(index + 1, 0, 1);
  }
};
/*************************************************************************************************************/
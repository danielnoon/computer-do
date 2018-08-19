import { State } from "./Interpreter";
import { Token } from "./lexer";

export function interpolateString(string: string, state: State) {
  return string.replace(/\$\w+/g, sub => {
    let variable = sub.substring(1, sub.length);
    return state.variables[variable];
  });
}

export function getStringData(token: Token, state: State) {
  return token.type === "Identifier" ? state.variables[token.value] : interpolateString(token.value.toString(), state);
}

export function getNumberData(token: Token, state: State) {
  return token.type === "Identifier" ? state.variables[token.value] : token.value;
}

export function doArithmetic(state: State, type: string, ...args: Token[]) {
  const x = getNumberData(args[0], state);
  const y = getNumberData(args[1], state);
  let value = 0;

  switch (type) {
    case "add":
      value = x + y;
      break;
    case "subtract":
      value = x - y;
      break;
    case "multiply":
      value = x * y;
      break;
    case "divide":
      value = x / y;
      break;
    case "mod":
      value = x % y;
      break;
  }

  state.variables[args[3].value] = value;
}

export function compare(state: State, left: Token, operator: Token, right: Token) {
  left = left.type === "Number" ? getNumberData(left, state) : getStringData(left, state);
  right = right.type === "Number" ? getNumberData(right, state) : getStringData(right, state);
  // console.log(left, operator, right);
  switch (operator.value) {
    case "=":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return left > right;
    case "<":
      return left < right;
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
  }
}

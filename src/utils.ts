import { State } from "./Interpreter";
import { Token, TokenType } from "./lexer";
import { Block } from "./parse";

export function interpolateString(string: string, state: State) {
  return string.replace(/\$\w+/g, sub => {
    let variable = sub.substring(1, sub.length);
    return getVar(variable, state);
  }).replace(/(\\n)/g, "\n").replace(/(\\")/g, "\"");
}

export function getVar(id: string, state: State) {
  let found = false;
  let index = 0;
  let b: Block = state.stack[0];
  while (!found) {
    const block = state.stack[state.stack.length - (index + 1)];
    if (block.type === "root") {
      b = block;
      found = true;
    }
    else {
      if (block.variables[id] !== undefined) {
        b = block;
        found = true;
      }
    }
    index++;
  }
  return b.variables[id];
}

export function setVar(id: string, value: any, state: State) {
  function getScope() {
    for (let i = 0; i < state.stack.length; i++) {
      let block = state.stack[state.stack.length - (i + 1)];
      if (block.type === "function" || block.type === "root") {
        return block;
      }
    }
    return state.stack[0];
  }
  const scope = getScope();
  scope.variables[id] = value;
}

export function getStringData(token: Token, state: State) {
  return token.type === "Identifier" ? getVar(token.value.toString(), state) : interpolateString(token.value.toString(), state);
}

export function getNumberData(token: Token, state: State) {
  return token.type === "Identifier" ? getVar(token.value.toString(), state) : token.value;
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
  setVar(args[3].value.toString(), value, state);
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

export function check(token: Token, type: TokenType, value?: any) {
  if (token.type === type) {
    if (value) {
      return token.value === value;
    }
    else return true;
  }
  else return false;
}

import { State } from "./Interpreter";
import { Token } from "./lexer";
import runLine from "./runLine";

function interpolateString(string: string, state: State) {
  return string.replace(/\$\w+/g, sub => {
    let variable = sub.substring(1, sub.length);
    return state.variables[variable];
  });
}

function getStringData(token: Token, state: State) {
  return token.type === "Identifier" ? state.variables[token.value] : interpolateString(token.value.toString(), state);
}

function getNumberData(token: Token, state: State) {
  return token.type === "Identifier" ? state.variables[token.value] : token.value;
}

function doArithmetic(state: State, type: string, ...args: Token[]) {
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

function compare(operator: Token, left: Token, right: Token, state: State) {
  left = left.type === "Number" ? getNumberData(left, state) : getStringData(left, state);
  right = right.type === "Number" ? getNumberData(right, state) : getStringData(right, state);
  console.log(left, right);
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

function runBlock(state: State) {
  let done = false;
  for (let line = state.currentLine + 1; !done; line++) {
    if (runLine(state.code[line], state) === "resume") done = true;
    if (done) {
      return line;
    }
  }
}

function skipToResume(state: State) {
  const res = "computer.do.resume";
  let curLine = state.currentLine;
  while (state.code[curLine].tokens[0].value.toString().toLowerCase() !== res) {
    curLine++;
  }
  state.currentLine = curLine;
}

export default {
  print(state: State, message: Token) {
    console.log(getStringData(message, state));
  },
  set(state: State, identifier: Token, value: Token) {
    state.variables[identifier.value] = value.value;
  },
  add(state: State, ...args: Token[]) {
    doArithmetic(state, "add", ...args);
  },
  mod(state: State, ...args: Token[]) {
    doArithmetic(state, "mod", ...args);
  },
  loop(state: State, ...args: Token[]) {
    if (args[1].value === "times") {
      let line = state.currentLine;
      for (let i = 0; i < getNumberData(args[0], state); i++) {
        line = runBlock(state)!;
      }
      state.currentLine = line;
    }
  },
  resume(state: State) {
    return "resume";
  },
  "if": function (state: State, left: Token, operator: Token, right: Token) {
    const c = compare(operator, left, right, state);
    console.log(left.value, right.value, operator.value, c);
    if (c) {
      runBlock(state);
    }
    else {
      skipToResume(state);
    }
  }
}

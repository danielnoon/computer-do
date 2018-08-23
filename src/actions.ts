import { State } from "./Interpreter";
import { Token } from "./lexer";
import { doArithmetic, getStringData, setVar, getVar, getNumberData } from "./utils";
// import * as rls from 'readline-sync';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export default {
  print(state: State, message: Token) {
    console.log(getStringData(message, state));
  },
  set(state: State, identifier: Token, value: Token) {
    if (!value) {
      console.error(`ERROR: Identifier ${identifier.value} is left undefined.`);
      return;
    }
    if (value.type === "Identifier") {
      setVar(identifier.value.toString(), getVar(value.value.toString(), state), state);
    }
    if (value.type === "String") {
      setVar(identifier.value.toString(), getStringData(value, state), state);
    }
    if (value.type === "Number") {
      setVar(identifier.value.toString(), getNumberData(value, state), state);
    }
  },
  ask(state: State, question: Token, to: Token, identifier: Token) {
    state.pause = true;
    rl.question(question.value.toString(), answer => {
      setVar(identifier.value.toString(), answer, state);
      state.pause = false;
    });
  },
  askNum(state: State, question: Token, to: Token, identifier: Token) {
    state.pause = true;
    const request = (q: string) => { 
      rl.question(q, answer => {
        const num = parseFloat(answer);
        if (isNaN(num)) {
          request("Please enter a number: ");
          return;
        }
        setVar(identifier.value.toString(), num, state);
        state.pause = false;
      });
    };
    request(question.value.toString());
  },
  add(state: State, ...args: Token[]) {
    doArithmetic(state, "add", ...args);
  },
  subtract(state: State, ...args: Token[]) {
    doArithmetic(state, "subtract", ...args);
  },
  multiply(state: State, ...args: Token[]) {
    doArithmetic(state, "multiply", ...args);
  },
  divide(state: State, ...args: Token[]) {
    doArithmetic(state, "divide", ...args);
  },
  mod(state: State, ...args: Token[]) {
    doArithmetic(state, "mod", ...args);
  },
  ignore(state: State) {
    // do nothing. it's a comment
  },
  namespace(state: State, ns: Token) {
    if (!state.namespaces.hasOwnProperty(ns.value)) {
      state.namespaces[ns.value] = {
        DO: {}
      }
    }
  },
  list(state: State, name: Token) {
    setVar(name.value.toString(), [], state);
  },
  getItem(state: State, from: Token, list: Token, index: Token, to: Token, variable: Token) {
    if (from.type === "Assignment") {
      if (from.value === "from") {
        if (list.type === "Identifier") {
          const l = getVar(list.value.toString(), state);
          if (l instanceof Array) {
            if (index.type === "Identifier" || index.type === "Number") {
              let item = l[getNumberData(index, state)];
              if (item) {
                if (to.type === "Assignment") {
                  if (to.value === "to") {
                    if (variable.type === "Identifier") {
                      setVar(variable.value.toString(), item, state);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  setItem(state: State, list: Token, index: Token, to: Token, variable: Token) {
    if (list.type === "Identifier") {
      const l = getVar(list.value.toString(), state);
      if (l instanceof Array) {
        if (index.type === "Identifier" || index.type === "Number") {
          if (to.type === "Assignment") {
            if (to.value === "to") {
              if (variable.type === "Identifier") {
                l[getNumberData(index, state)] = variable.type === "Identifier"
                  ? getVar(variable.value.toString(), state) 
                  : variable.type === "String"
                    ? getStringData(variable, state)
                    : variable.value
                console.log(l);
              }
            }
          }
        }
      }
    }
  },
  push(state: State, ...tokens: Token[]) {
    let newData = [];
    let reachedTo = false;
    for (let token of tokens) {
      if (!reachedTo) {
        if (token.type === "Assignment") {
          if (token.value === "to") reachedTo = true;
        }
        else {
          if (token.type === "Identifier") {
            newData.push(getVar(token.value.toString(), state));
          }
          else if (token.type === "String") {
            newData.push(getStringData(token, state));
          }
          else if (token.type === "Number") {
            newData.push(getNumberData(token, state));
          }
        }
      }
    }
    if (reachedTo) {
      if (tokens[tokens.length - 1].type === "Identifier") {
        const arr = getVar(tokens[tokens.length - 1].value.toString(), state);
        if (arr instanceof Array) {
          setVar(tokens[tokens.length - 1].value.toString(), arr.concat(newData), state);
        }
      }
    }
  },
  pop(state: State, from: Token, array: Token, to: Token, variable: Token) {
    if (from.type === "Assignment" && from.value === "from") {
      if (array.type === "Identifier") {
        const arr = getVar(array.value.toString(), state);
        if (arr instanceof Array) {
          if (to.type === "Assignment" && to.value === "to") {
            if (variable.type === "Identifier") {
              const val = arr.pop();
              setVar(variable.value.toString(), val, state);
            }
          }
        }
      }
    }
  }
}

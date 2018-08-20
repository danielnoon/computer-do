import { State } from "./Interpreter";
import { Token } from "./lexer";
import { doArithmetic, getStringData } from "./utils";
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
    state.variables[identifier.value] = value.value;
  },
  ask(state: State, question: Token, to: Token, identifier: Token) {
    state.pause = true;
    rl.question(question.value.toString(), answer => {
      state.variables[identifier.value] = answer;
      state.pause = false;
    });
    // const val = rls.question(getStringData(question, state));
    // state.variables[identifier.value] = val;
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
        state.variables[identifier.value] = num;
        state.pause = false;
      });
    };
    request(question.value.toString());
    // const val = rls.questionFloat(getStringData(question, state));
    // state.variables[identifier.value] = val;
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
  }
}

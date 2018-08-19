import { State } from "./Interpreter";
import { Token } from "./lexer";
import { doArithmetic, getStringData } from "./utils";

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
  }
}

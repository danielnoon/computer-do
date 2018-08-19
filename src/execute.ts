import { State } from "./Interpreter";
import runLine from "./runLine";

export default function execute(state: State) {
  while (!state.done) {
    if (!state.pause) {
      runLine(state.code[state.currentLine], state);
      state.currentLine++;
      if (state.code.length < state.currentLine) state.done = true;
    }
  }
}
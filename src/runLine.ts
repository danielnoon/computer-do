import { Line } from "./lexer";
import { State } from "./Interpreter";

export default function runLine(line: Line, state: State) {
  if (state.currentLine >= state.code.length) return;
  let tokens = [...line.tokens];
  const commandTree = tokens.shift()!.value.toString().split(".");
  return state.namespaces[commandTree[0]].DO[commandTree[2]](state, ...tokens);
}
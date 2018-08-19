import { State } from "./Interpreter";
import { Block, Command } from "./parse";
import { compare } from "./utils";

export default function execute(state: State) {
  let count = 0;
  const stack: Block[] = [
    state.code
  ];
  console.log(stack);
  while (stack.length > 0) {
    const block = stack[stack.length - 1];

    if (block.lines.length > 0) {
      const next = stack[stack.length - 1].lines.shift();
      stack[stack.length - 1].lineHistory.push(next!);
      if (next instanceof Command) {
        state.namespaces[next.namespace].DO[next.method](state, ...next.args);
      }
      if (next instanceof Block) {
        if (next.type === "conditional") {
          // console.log(next.args![0], next.args![1], next.args![2]);
          const c = compare(state, next.args![0], next.args![1], next.args![2]);
          console.log(c);
          if (c) {
            stack.push(next);
          }
        }
        else {
          if (next.lineHistory.length !== 0) {
            next.lines = next.lineHistory;
            next.lineHistory = [];
          }
          stack.push(next);
        }
      }
    }
    else {
      if (block.type === "loop") {
        if (block.loopRepeats >= block.args![0].value) {
          stack.pop();
        }
        else {
          block.loopRepeats++;
          block.lines = block.lineHistory;
          block.lineHistory = [];
        }
      }
      else {
        stack.pop();
      }
    }
  }
}

import { State } from "./Interpreter";
import { Block, Command } from "./parse";
import { compare, getNumberData } from "./utils";

export default function execute(state: State) {
  let count = 0;
  const stack: Block[] = [
    state.code
  ];
  // console.log(stack);
  const loop = setInterval(() => {
    if (stack.length === 0) {
      clearInterval(loop);
      process.exit(0);
      return;
    }
    if (!state.pause) {
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
            // console.log(c);
            if (c) {
              if (next.lineHistory.length !== 0) {
                next.lines = next.lineHistory;
                next.lineHistory = [];
              }
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
          const ceiling = getNumberData(block.args![0], state);
          if (block.loopRepeats >= ceiling) {
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
  });
}

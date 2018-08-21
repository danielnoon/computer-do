import { State } from "./Interpreter";
import { Block, Command } from "./parse";
import { compare, getNumberData, getVar } from "./utils";
import { Token } from "./lexer";

export default function execute(state: State) {
  const stack = state.stack;
  stack.push(state.code);
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
            const c = compare(state, next.args![0], next.args![1], next.args![2]);
            if (c) {
              if (next.lineHistory.length !== 0) {
                next.lines = next.lineHistory;
                next.lineHistory = [];
              }
              stack.push(next);
            }
          }
          else if (next.type === "function") {
            const fname = next.args!.shift()!.value;
            state.namespaces[next.ns!].DO[fname] = (state: State, ...args: Token[]) => {
              if (next.lineHistory.length !== 0) {
                next.lines = next.lineHistory;
                next.lineHistory = [];
              }
              let i = 0;
              for (let arg of args) {
                next.variables[next.args![i].value] = arg.type === "Identifier" ? getVar(arg.value.toString(), state) : arg.value;
                i++;
              }
              state.stack.push(next);
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
          if (block.loopRepeats >= ceiling - 1) {
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

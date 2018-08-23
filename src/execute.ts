import { Namespaces, State } from "./Interpreter";
import { Block, Command } from "./parse";
import { compare, getNumberData, getVar, getStringData, setVar } from "./utils";
import { Token } from "./lexer";

export default function execute(state: State) {
  return new Promise<Namespaces>((resolve, reject) => {
    const stack = state.stack;
    stack.push(state.code);
    const loop = setInterval(() => {
      if (stack.length === 0) {
        clearInterval(loop);
        if (!state.isModule) process.exit(0);
        else resolve(state.exports);
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
            if (next.lineHistory.length !== 0) {
              next.lines = next.lineHistory;
              next.lineHistory = [];
            }
            next.loopRepeats = 0;
            if (next.type === "conditional") {
              const c = compare(state, next.args![0], next.args![1], next.args![2]);
              if (c) {
                stack.push(next);
              }
            }
            else if (next.type === "function") {
              const fname = next.args!.shift()!.value;
              state.namespaces[next.ns!].DO[fname] = (state: State, ...args: Token[]) => {
                let i = 0;
                let foundTo = false;
                for (let arg of args) {
                  if (arg.type === "Assignment") {
                    if (arg.value === "to") {
                      foundTo = true;
                    }
                  }
                  else if (!foundTo) {
                    next.variables[next.args![i].value] = arg.type === "Identifier" ? getVar(arg.value.toString(), state) : arg.value;
                    i++;
                  }
                }
                if (foundTo) {
                  next.returnTo = args[args.length - 1];
                }
                state.stack.push(next);
              }
            }
            else {
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
          else if (block.type === "function") {
            if (block.returnToken) {
              const value = block.returnToken.type === "Identifier"
                ? getVar(block.returnToken.value.toString(), state)
                : block.returnToken.type === "String"
                  ? getStringData(block.returnToken, state)
                  : block.returnToken.value;
              stack.pop();
              if (block.returnTo) {
                setVar(block.returnTo.value.toString(), value, state);
              }
            }
          }
          else {
            stack.pop();
          }
        }
      }
    });
  })
}

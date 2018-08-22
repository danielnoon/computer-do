import { Line, Token } from "./lexer";

export class Block {
  lines: (Command | Block)[] = [];
  lineHistory: (Command | Block)[] = [];
  loopRepeats = 0;
  variables: {
    [propName: string]: any
  } = {};
  returnToken?: Token;
  returnTo?: Token;
  constructor(public type: "root" | "loop" | "conditional" | "function", public args?: Token[], public ns?: string) {}
}

export class Command {
  constructor(public namespace: string, public method: string, public args: Token[]) {}
}

const blocks = [
  "computer.do.loop",
  "computer.do.if",
  "define"
];

function addBlock(block: Block, lines: Line[]) {
  while (lines.length > 0) {
    const line = lines.shift()!;
    const command = line.tokens.shift()!.value.toString();
    const cmdParts = command.split('.');
    if (cmdParts[2].toLowerCase() === "return") {
      if (block.type === 'function') {
        if (line.tokens[0]) {
          block.returnToken = line.tokens[0];
        }
      }
      return;
    }
    if (blocks.indexOf(command.toLowerCase()) === -1) {
      if (cmdParts[2] === blocks[2]) {
        const func = new Block('function', line.tokens, cmdParts[0]);
        block.lines.push(func);
        addBlock(func, lines);
      }
      else {
        block.lines.push(new Command(cmdParts[0], cmdParts[2], line.tokens));
      }
    }
    else if (command.toLowerCase() === blocks[0]) {
      const loop = new Block('loop', line.tokens);
      block.lines.push(loop);
      addBlock(loop, lines);
    }
    else if (command.toLowerCase() === blocks[1]) {
      const conditional = new Block('conditional', line.tokens);
      block.lines.push(conditional);
      addBlock(conditional, lines);
    }
  }
}

export default function parse(lines: Line[]) {
  const program = new Block("root");
  addBlock(program, lines);
  return program;
}
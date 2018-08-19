import { Line } from "./lexer";

export class Block {
  lines: (Command | Block)[] = [];
  lineHistory: (Command | Block)[] = [];
  loopRepeats = 0;
  constructor(public type: "root" | "loop" | "conditional", public args?: any[]) {}
}

export class Command {
  constructor(public namespace: string, public method: string, public args: any[]) {}
}

const blocks = [
  "computer.do.loop",
  "computer.do.if"
];

function addBlock(block: Block, lines: Line[]) {
  while (lines.length > 0) {
    const line = lines.shift()!;
    const command = line.tokens.shift()!.value.toString();
    if (command.toLowerCase() === "computer.do.return") return;
    if (blocks.indexOf(command.toLowerCase()) === -1) {
      const cmdParts = command.split('.');
      block.lines.push(new Command(cmdParts[0], cmdParts[2], line.tokens));
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
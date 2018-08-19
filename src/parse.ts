import { Line } from "./lexer";

class Block {
  lines: (Command | Block)[] = [];
  constructor(public type: "root" | "loop" | "conditional") {}
}

class Command {
  constructor(public namespace: string, public method: string, public args: any[]) {}
}

const blocks = [
  "computer.do.loop",
  "computer.do.if"
];

function addBlock(block: Block, lines: Line[]) {
  for (let line of lines) {
    if (blocks.indexOf(line.tokens[0].value.toString()) === -1) {

    }
  }
}

export default function parse(lines: Line[]) {
  const program = new Block("root");
  addBlock(program, lines);
}
import { readFileSync } from "fs";
import { parse } from "./parser";

const text = readFileSync(
  __dirname + "/../../examples/linkedlist.cdo",
  "utf-8"
).trim();

const start = Date.now();
const ast = parse(text);
const end = Date.now() - start;

console.log(ast);

console.log(`Parsed in ${end}ms`);

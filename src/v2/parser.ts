import * as nearley from "nearley";
import * as grammar from "./grammar.js";

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar as any));

export function parse(text: string) {
  parser.feed(text);
  return parser.results[0];
}

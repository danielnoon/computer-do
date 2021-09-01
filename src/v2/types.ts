export interface Node {
  type: string;
}

export interface Token extends Node {
  text: string;
  offset: number;
  line: number;
  column: number;
}

export interface Identifier extends Token {
  type: "id";
  value: string;
}

export interface StringLiteral extends Token {
  type: "string";
  value: string;
}

export interface NumberLiteral extends Token {
  type: "number";
  value: number;
}

export interface BooleanLiteral extends Token {
  type: "boolean";
  value: boolean;
}

export interface Actor extends Node {
  type: "ACTOR";
  name: Identifier;
  body: Node[];
}

export interface Assignment extends Node {
  type: "ASSIGNMENT";
  name: Identifier;
  value: Node;
}

export type BinaryOperator = "ADD" | "SUB" | "MUL" | "DIV" | "POW";

export interface ArithmeticExpression extends Node {
  type: "ARITH";
  op: BinaryOperator;
  left: Node;
  right: Node;
}

export type ComparisonOperator = "EQ" | "NEQ" | "LT" | "LEQ" | "GT" | "GEQ";

export interface CompExpression extends Node {
  type: "COMP";
  op: ComparisonOperator;
  left: Node;
  right: Node;
}

export type BinaryLogicalOperator = "AND" | "OR";

export interface BinaryLogicalExpression extends Node {
  type: "LOGIC";
  op: BinaryLogicalOperator;
  left: Node;
  right: Node;
}

export interface UnaryLogicalExpression extends Node {
  type: "LOGIC";
  op: "NOT";
  operand: Node;
}

export type LogicalExpression =
  | BinaryLogicalExpression
  | UnaryLogicalExpression;

export interface TimesExpression extends Node {
  type: "TIMES";
  number: Node;
}

export interface CallExpression extends Node {
  type: "CALL";
  expr: Expression;
  args: Node[];
}

export interface GetterExpression extends Node {
  type: "GETTER";
  actor: Identifier;
  action: Identifier;
}

export interface SelectorExpression extends Node {
  type: "SELECTOR";
  base: Expression;
  expr: Expression;
}

export interface List extends Node {
  type: "LIST";
  elements: Node[];
}

export interface Dict extends Node {
  type: "DICT";
  entries: Node[];
}

export type LiteralExpression =
  | StringLiteral
  | NumberLiteral
  | BooleanLiteral
  | List
  | Dict;

export type Expression =
  | CallExpression
  | GetterExpression
  | SelectorExpression
  | LiteralExpression
  | ArithmeticExpression
  | CompExpression
  | LogicalExpression
  | TimesExpression
  | Identifier;

export interface Function extends Node {
  type: "FUNCTION";
  params: Identifier[];
  body: FuncBody;
}

export interface FuncBody extends Node {
  type: "FUNCBODY";
  body: Node[];
}

export interface FuncExpr extends Node {
  type: "FUNCEXPR";
  body: Expression;
}

export interface Instruction extends Node {
  type: "INSTRUCTION";
  actor: Identifier;
  action: Identifier;
  args: Expression[];
}

export interface IfStatement extends Node {
  type: "CONDITIONAL";
  test: Expression;
  body: Node[];
  else: ElseStatement | IfStatement | null;
}

export interface ElseStatement extends Node {
  type: "ELSE";
  body: Node[];
}

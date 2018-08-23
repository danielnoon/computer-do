import lex, { Line } from './lexer';
import execute from './execute';
import actions from "./actions";
import parse, { Block } from "./parse";


export class InterpreterOptions {
  module = false;
}

export interface Namespaces {
  [propName: string]: {
    DO: {
      [propName: string]: (state: State, ...args: any[]) => any
    }
  }
}

export class State {
  currentLine = 0;
  code = new Block('root');
  done = false;
  pause = false;
  isModule = false;
  namespaces: Namespaces = {
    Computer: {
      DO: {
        ...actions
      }
    },
  };
  variables: {
    [propName: string]: any
  } = {};
  stack: Block[] = [];
  exports: Namespaces = {};
}

class Interpreter {
  options = new InterpreterOptions();
  state = new State();

  constructor(options?: InterpreterOptions) {
    if (options) this.options = options;
  }

  public run(code: string) {
    this.state.code = parse(lex(code));
    if (this.options.module) {
      this.state.isModule = true;
    }
    return execute(this.state);
  }
}

export default Interpreter;

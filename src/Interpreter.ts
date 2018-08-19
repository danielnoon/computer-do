import lex, { Line } from './lexer';
import execute from './execute';
import actions from "./actions";
import parse, { Block } from "./parse";


export class InterpreterOptions {

}

export class State {
  currentLine = 0;
  code = new Block('root');
  done = false;
  pause = false;
  namespaces: {
    [propName: string]: {
      DO: {
        [propName: string]: (state: State, ...args: any[]) => any
      }
    }
  } = {
    Computer: {
      DO: {
        ...actions
      }
    },
  };
  variables: {
    [propName: string]: any
  } = {};
}

class Interpreter {
  options = new InterpreterOptions();
  state = new State();

  constructor(options?: InterpreterOptions) {
    if (options) this.options = options;
  }

  public run(code: string) {
    this.state.code = parse(lex(code));
    execute(this.state);
  }
}

export default Interpreter;

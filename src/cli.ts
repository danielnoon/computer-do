#!/usr/bin/env node

import * as program from 'commander';
import * as fs from 'fs';

import Interpreter from './Interpreter';

program
  .version('0.1.0')
  .usage('<source>')
  .parse(process.argv);

const file = fs.readFileSync(program.args[0], 'utf-8');

const interpreter = new Interpreter();
interpreter.run(file);
// process.exit();

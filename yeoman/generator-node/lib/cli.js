#!/usr/bin/env node
'use strict';
const meow = require('meow');
const lxNodeStudy = require('.');

const cli = meow(`
Usage
  $ lx-node-study [input]

Options
  --foo  Lorem ipsum. [Default: false]

Examples
  $ lx-node-study
  unicorns
  $ lx-node-study rainbows
  unicorns & rainbows
`);

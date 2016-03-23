#!/usr/bin/env node
'use strict';
var meow = require('meow');
var chalk = require('chalk');
const updateNotifier = require('update-notifier');
var dosk = require('./');

var cli = meow([
  'Usage',
  '  $ dosk [flag] [input]',
  '',
  'Options',
  '  -a   add a new alias',
  '  -r   remove a previous alias',
  '  -l   list the aliases you already have',
  '  -e   edit a previous aliases command',
  '  --en  rename a previous alias from _ to _',
  '  --em  edit a previous alias manually',
  '  --ed  edit a previous aliases description',
  '  --echo turn echo on/off with input on/off.  Off by default',
  '',
  'Examples',
  '  $ dosk md "mkdir \"$*\"$tcd \"$*\"" -a',
  '    creates a new alias called md which makes a new directory and changes to that directory',
  '    Use \ to escape quotes',
  '',
  '  $ dosk ls "dir /B" "Lists the directories without excessive information" -a',
  '    Creates a new alias ls with the description "Lists the directories without excessive information"',
  '    description must come last',
  '',
  '  $ dosk ls -r',
  '    Removes the alias ls from the list',
  '',
  '  $ dosk -l',
  '    lists the alaises in the .cmd file',
  '',
  '  $ dosk ls dir -e',
  '    change the command to dir',
  '',
  '  $ dosk ls list --en',
  '    Rename ls to list',
  '',
  '  $ dosk ls "list directories and files" --ed',
  '    change the description of ls to "list directories and files"',
  '',
  '  $ dosk -em',
  '    Opens the .cmd file for manual editing',
  '',
  '  $ dosk on --echo',
  '    Turns echo on',
  '',
  'Due to security concerns these changes are made permanent manually',
  'To make these changes permanent you need to edit the registry.',
  'You can do that by going typing \'regedit\' in start. Then going to',
  'HKEY_CURRENT_USER->Software->Microsoft->Command Processor',
  'Add a new String Value with',
  ' Name: AutoRun',
  ' Data: C:\\Windows\\System32\\env.cmd'
]);

updateNotifier({pkg: cli.pkg}).notify();
var flag = Object.keys(cli.flags)[0];

if (Object.keys(cli.flags).length !== 1) {
  console.error(chalk.red('dosk expected 1 flag, got ' + Object.keys(cli.flags).length));
  console.log(cli.help);
  process.exit(1);
}

if (['a', 'r', 'l', 'e', 'en', 'ed', 'en', 'em', 'echo'].indexOf(flag) === -1) {
  console.error(chalk.red('dosk got unexpected flag ' + flag));
  console.log(cli.help);
  process.exit(1);
}

if (cli.input.length !== 1 && (flag.toLowerCase() === 'r' || flag.toLowerCase() === 'echo')) {
  console.error(chalk.red('dosk expected alias, func, and optionally a description, got more or less'));
  console.log(cli.help);
  process.exit(1);
}

if (cli.input.length !== 2 && cli.input.length !== 3 && ['a', 'e', 'en', 'ed'].indexOf(flag) !== -1) {
  console.error(chalk.red('dosk expected alias, func, and optionally a description, got more or less'));
  console.log(cli.help);
  process.exit(1);
}

dosk(cli.input, Object.keys(cli.flags)[0]);

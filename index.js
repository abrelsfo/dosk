'use strict';
var chalk = require('chalk');
var fs = require('fs');
var shell = require('shelljs');
var prompt = require('prompt');
var doskeys;
var commands = {};
var ecko = 'off';
var key;
var i;

// ==============================================================================

function ls() {
  console.log('');
  for (key in commands) {
    if ({}.hasOwnProperty.call(commands, key)) {
      console.log(key + '=' + commands[key].func);
      if (commands[key].desc !== undefined) {
        console.log('::' + commands[key].desc);
      }
      console.log('');
    }
  }
}

// ==============================================================================

function checkForCmd(input, flag) {
  fs.stat('C:/Windows/System32/env.cmd', function (err) {
    if (err === null) {
      openFile(input, flag);
    } else if (err.code === 'ENOENT') {
      fs.writeFile('C:/Windows/System32/env.cmd', '');
      makeFile(input, flag);
    } else {
      console.log('Some other error: ', err.code);
    }
  });
}

// ==============================================================================

function makeFile(input, flag) {
  fs.writeFile('C:/Windows/System32/env.cmd', '', {flags: 'w'}, function (error) {
    if (error) {
      console.error(chalk.red('Error creating env.cmd'));
      process.exit(1);
    }
    console.log(chalk.blue('Created env.cmd\n'));
    console.log(chalk.yellow('======================================================================'));
    console.log(chalk.green(' Due to security concerns these changes are made permanent manually'));
    console.log(chalk.green(' To make these changes permanent you need to edit the registry'));
    console.log(chalk.green(' You can do that by going typing regedit in start. Then going to'));
    console.log(chalk.green(' HKEY_CURRENT_USER->Software->Microsoft->Command Processor'));
    console.log(chalk.green(' Add a new String Value with'));
    console.log(chalk.green(' Name: AutoRun'));
    console.log(chalk.green(' Data: C:\\Windows\\System32\\env.cmd'));
    console.log(chalk.green(' After that, restart the command prompt for changes to take effect'));
    console.log(chalk.yellow('======================================================================'));
    openFile(input, flag);
  });
}

// ==============================================================================

function openFile(input, flag) {
  fs.readFile('C:/Windows/System32/env.cmd', 'utf8', function read(err, data) {
    if (err) {
      throw err;
    }

    data = data.replace('\r\n', '\n');
    data = data.split('\n');
    for (i = 0; i < data.length; i++) {
      if (data[i].startsWith('@echo')) {
        ecko = data[i].slice(6, data[i].length);
      }

      if (data[i].startsWith('DOSKEY')) {
        var line = data[i].slice(7, data[i].length).split('=');
        key = line[0];
        if (key in commands) {
          console.log(chalk.red('alias already exists, find a new name'));
        } else {
          commands[key] = {func: line[1], desc: undefined};
        }
      }

      if (data[i].startsWith('::')) {
        commands[key].desc = data[i].slice(2, data[i].length);
      }
    }

    if (flag[0].toLowerCase() === 'r') {
      delete commands[input[0]];
      console.log(chalk.red('deleted ' + input[0]));
      writeToFile();
    } else if (flag[0].toLowerCase() === 'l') {
      ls();
    } else {
      editEnv(input, flag);
    }
  });
}

// ==============================================================================

function editEnv(input, flag) {
  switch (flag.toLowerCase()) {
    case 'a':
      add(input);
      break;
    case 'e':
      ec(input);
      break;
    case 'en':
      en(input);
      break;
    case 'em':
      em();
      break;
    case 'ed':
      ed(input);
      break;
    case 'echo':
      echo(input);
      break;
    default:  // state something is wrong
      console.error('Something is wrong! Unrecognized flag, ' + flag);
      process.exit(1);
      break;
  }
}

// ==============================================================================

function add(input) {
  if (input[0] in commands) {
    console.error(chalk.red(input[0] + ' is already an alias'));
  } else {
    commands[input[0]] = {func: input[1], desc: input[2]};
    console.log(chalk.green('Added alias ' + input[0]));
    writeToFile();
  }
}

// ==============================================================================

function ec(input) {
  if (input[0] in commands) {
    var old = commands[input[0]].func;
    commands[input[0]].func = input[1];
    console.log(chalk.green('Changed ' + input[0] + 'from "' + old + '" to "' + input[1] + '"'));
    writeToFile();
  } else {
    console.error(chalk.red(input[0] + ' is not an alias'));
  }
}

// ==============================================================================

function en(input) {
  if (input[0] in commands) {
    commands[input[1]] = commands[input[0]];
    delete commands[input[0]];
    console.log(chalk.green('changed ' + input[0] + ' to ' + input[1]));
    writeToFile();
  } else {
    console.error(chalk.red(input[0] + ' is not an alias'));
  }
}

// ==============================================================================

function em() {
  shell.exec('start notepad C:/Windows/System32/env.cmd');
}

// ==============================================================================

function ed(input) {
  if (input[0] in commands) {
    commands[input[0]].desc = input[1];
    console.log(chalk.green('changed ' + input[0] + ' description to ' + input[1]));
    writeToFile();
  } else {
    console.error(chalk.red(input[0] + ' is not an alias'));
  }
}

// ==============================================================================

function echo(input) {
  if (input[0].toLowerCase() === 'on' || input[0].toLowerCase() === 'off') {
    ecko = input[0].toLowerCase();
    console.log(chalk.green('echo set to ' + input[0]));
    writeToFile();
  } else {
    console.error(chalk.red('echo expected on or off, got ' + input[0]));
  }
}

// ==============================================================================

function writeToFile() {
  doskeys = '@echo ' + ecko + '\n\n';
  for (key in commands) {
    if ({}.hasOwnProperty.call(commands, key)) {
      doskeys += 'DOSKEY ' + key + '=' + commands[key].func + '\n';
      if (commands[key].desc !== undefined) {
        doskeys += '::' + commands[key].desc + '\n';
      }
      doskeys += '\n';
    }
  }
  doskeys = doskeys.replace(/\n/g, '\r\n');

  fs.writeFile('C:/Windows/System32/env.cmd', doskeys, {flags: 'w'}, function (err) {
    if (err) {
      console.error(chalk.red('Error writing to env.cmd'));
      process.exit(1);
    }
    console.log(chalk.green('env.cmd has been updated'));
    prompt.get(['Restart Prompt yes/no'], function (err, res) {
      if (err) {
        throw (err);
      }

      if (res.toLowerCase() === 'yes') {
        shell.exec('cmd.exe');
      } else if (res.toLowerCase() !== 'no') {
        console.log(chalk.red('Answer should be yes or no. Type cmd.exe to restart manually'));
      }
    });
  });
}

// ==============================================================================

module.exports = function (input, flag) {
  checkForCmd(input, flag);
};
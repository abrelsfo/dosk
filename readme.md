# dosk
[![npm version](https://img.shields.io/npm/v/dosk.svg)](https://www.npmjs.com/package/dosk)
[![npm download count](http://img.shields.io/npm/dm/dosk.svg?style=flat)](http://npmjs.org/dosk)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
> npm module to Quickly add, describe, and list Windows cmd prompt aliases

<br>

## Install

```
$ npm install --save dosk
```


## Usage

```js
const dosk = require('dosk');

dosk(['ls', 'dir /B', 'Print files without the extra bloat'], 'a');
//=> adds the alias ls with command dir /B with description Print files without the extra bloat

dosk([],'l');
//=> Prints the aliases
```

<br>

## API

### dosk(input, flag)

##### input

Type: `Array`

##### flag

Type: `string`

Quickly add, describe, and list Windows cmd prompt aliases

<br>

## CLI

```
$ npm install --global dosk
```

```
Usage
  $ dosk [flag] [input]

Options
  -a   add a new alias
  -r   remove a previous alias
  -l   list the aliases you already have
  -e   edit a previous aliases command
  --en  rename a previous alias from _ to _
  --em  edit a previous alias manually
  --ed  edit a previous aliases description
  --echo turn echo on/off with input on/off.  Off by default

Examples
  $ dosk md "mkdir \"$*\"$tcd \"$*\"" -a
    creates a new alias called md which makes a new directory and changes to that directory
    Use \ to escape quotes

  $ dosk ls "dir /B" "Lists the directories without excessive information" -a
    Creates a new alias ls with the description "Lists the directories without excessive information"
    description must come last

  $ dosk ls -r
    Removes the alias ls from the list

  $ dosk -l
    lists the alaises in the .cmd file

  $ dosk ls dir -e
    change the command to dir

  $ dosk ls list --en
    Rename ls to list

  $ dosk ls "list directories and files" --ed
    change the description of ls to "list directories and files"

  $ dosk --em
    Opens the .cmd file for manual editing

  $ dosk on --echo
    Turns echo on

Due to security concerns these changes are made permanent manually.
To make these changes permanent you need to edit the registry.
You can do that by going typing \'regedit\' in start. Then going to
HKEY_CURRENT_USER->Software->Microsoft->Command Processor
Add a new String Value with
 Name: AutoRun
 Data: C:\Windows\System32\env.cmd
```

## Useful Aliases

```
ls=dir /B
::Lists all files and directories without the extra bloat of dir

c=cls
::Easier to remember way to clear screen

md=mkdir "&*"$tcd "$*"
::Make a new directory and immediately switch to it

res=cmd.exe
::Start another instance of cmd.exe inside current window.
::Useful for new changes to take effect
```

If anyone has more useful aliases that they use regularly then create an issue and I'll add them

## License

MIT © [Alex Brelsford](abrelsfo.github.io)

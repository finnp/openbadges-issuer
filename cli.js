#!/usr/bin/env node
var program = require('nomnom')

program.script('issuer')

program.command('init')
  .callback(require('./lib/commands/init.js'))
  .help('Issuer and class information')
  
program.command('add')
  .callback(require('./lib/commands/add.js'))
  .help('Issue a badge to a person')
  
program.command('issuer')
  .callback(require('./lib/commands/issuer.js'))
  .help('Create issuer information (issuer.json)')
  
program.command('class')
  .callback(require('./lib/commands/class.js'))
  .help('Create class information (class.json)')

program.parse()
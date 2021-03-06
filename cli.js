#!/usr/bin/env node
var program = require('nomnom')

program.script('issuer')

program.command('add')
  .callback(require('./lib/commands/add.js'))
  .help('Issue a badge to a person')
  .options({
    email: {
      position: 1,
      help: 'Email adresses to issue a badge to',
      list: true
    },
    nohash: {
      help: "Do not hash the email adresses",
      flag: true
    },
    path: {
      help: "The path to add the badge",
      default: process.cwd()
    }
  })
  
program.command('issuer')
  .callback(require('./lib/commands/issuer.js'))
  .help('Create issuer information (issuer.json)')
  
program.command('class')
  .callback(require('./lib/commands/class.js'))
  .help('Create class information (class.json)')

program.parse()
#!/usr/bin/env node
var resolve = require('url').resolve
var path = require('path')
var fs = require('fs')
var prompt = require('sync-prompt').prompt
var program = require('nomnom')
var dateFormat = require('iso8601').fromDate

program.script('issuer')

program.command('init')
  .callback(function () {
    issuerCmd()
    classCmd()
  })
  .help('Issuer and class information')
  
program.command('add')
  .callback(addCmd)
  .help('Issue a badge to a person')
  
program.command('issuer')
  .callback(issuerCmd)
  .help('Create issuer information (issuer.json)')
  
program.command('class')
  .callback(classCmd)
  .help('Create class information (class.json)')

program.parse()

// Commands

function addCmd() {
  var root = determineIssuerRoot()
  var issuer = require(path.join(root, 'issuer.json'))
  
  var dir
  if(!path.relative(root, process.cwd())) {
    var files = fs.readdirSync(root)
    console.log('For which badge?')
    files
      .filter(function (file) {
        return file.slice(0,6) === 'badge-'
      })
      .forEach(function (file) {
        console.log('- ' + file)
      })
    // a select like inquirer would be nice here
    var dirName = 'badge-' + prompt('Directory? badge-')
    dir = path.join(process.cwd(), dirName)
  } else {
    if(path.basename(process.cwd()).slice(0,6) !== 'badge-') {
      console.error('Not in a badge directory')
      process.exit()
    }
    dir = process.cwd()
  }
  
  var classPath = path.join(dir, 'class.json')
  if(fs.existsSync(classPath)) {
    var badgeClass = require(classPath)
  } else {
    console.error('No class.json found. First add this to your badge directory.')
    process.exit()
  }
  
  // Determine the ID of the most recently issued badge
  var files = fs.readdirSync('./')  
  var maxId = files.reduce(function (acc, file) {
    if(!file.match(/\d+\.json/)) return acc
    var number = parseInt(file)
    return number > acc ? number : acc
  }, 0)
    
  var receiver = {}
  console.log('Information for the receiver of the badge')
  // how to determine the id?
  receiver.uid = maxId + 1
  console.log('Reiceiver ID ' + receiver.uid)
  receiver.recipient = {
    type: 'email',
    hashed: false
  }
  receiver.recipient.identity = prompt('Email? ')
  receiver.issuedOn = dateFormat(new Date())
  receiver.badge = resolve(issuer.url, 'class.json')
  receiver.verify = {
    type: 'hosted'
  }
  var filename =  receiver.uid + '.json'
  receiver.verify.url = resolve(issuer.url, filename)
  
  writeJSON(path.join(dir, filename), receiver)
}

function issuerCmd() {
  var issuer = {}
  // issuer.json
  console.log('Issuer information:')
  issuer.name = prompt('Name? ')
  issuer.url = prompt('Root url? ')
  
  writeJSON(path.join(process.cwd(), 'issuer.json'), issuer)
}

function classCmd() {
  
  var root = determineIssuerRoot()
  
  var issuer = require(path.join(root, 'issuer.json'))
  
  // create subdirectory for class
  var dirName = 'badge-' + prompt('Name for the subfolder? badge-')
  var dir = path.join(root, dirName)
  fs.mkdirSync(dir)
  
  // class.json
  var badgeClass = {}
  badgeClass.name = prompt('Name? ')
  badgeClass.description = prompt('Description? ')
  // assuming badge.png as an image for now
  badgeClass.image = resolve(issuer.url, 'badge.png')
  console.log('Image: ' + badgeClass.image)

  // the criteria should also be  created by the tool
  // maybe it should ask for a file or create it
  var criteria = prompt('Criteria? ' + issuer.url)
  badgeClass.criteria = resolve(issuer.url, criteria)

  badgeClass.issuer = resolve(issuer.url, 'issuer.json')
  console.log('Issuer: ' + badgeClass.issuer)  
  
  writeJSON(path.join(dir, 'class.json'), badgeClass)
}

// Helper

function determineIssuerRoot() {
  if(fs.existsSync('./issuer.json'))
    return process.cwd()
  if(fs.existsSync('../issuer.json'))
    return path.normalize(path.join(process.cwd(), '..'))
  console.error('No root directory found. Please add an issuer.json first.')
  process.exit()
}

function writeJSON(writePath, json) {
  console.log('Writing ' + path.basename(writePath) + '...')
  fs.writeFileSync(writePath, JSON.stringify(json, null, '  '))
  console.log('Done.')
}
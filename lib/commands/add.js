var path = require('path')
var crypto = require('crypto');
var fs = require('fs')
var urljoin = require('url-join')
var prompt = require('inquirer').prompt
var hash = require('dollar-hash')

var helper = require('../helper.js')

module.exports = function (opts) {
  var root = helper.determineIssuerRoot()
  var issuer = require(path.join(root, 'issuer.json'))
  var questions = []
  var emails = opts.email || []
  var shouldHash = !opts.nohash
  
  var dir, dirName
  if(!path.relative(root, process.cwd())) {
    var files = fs.readdirSync(root)
    files = files.filter(function (file) {
      var isDir = fs.statSync(file).isDirectory()
      return isDir && fs.existsSync(path.join(file, 'class.json'))
    })
    if(files.length === 0) {
      console.error('No badges found. Add one with `issuer class`')
      process.exit()
    }
    if(files.length > 1) {
      questions.push({
        type: 'list',
        name: 'dirName',
        message: 'Select for which badge',
        choices: files
      })
    } else {
      dirName = files[0]
      console.log('Adding to ' + dirName)
      dir = path.join(process.cwd(), dirName)
    }
  } else {
    if(path.basename(process.cwd()).slice(0,6) !== 'badge-') {
      console.error('Not in a badge directory')
      process.exit()
    }
    dir = process.cwd()
    dirName = path.basename(process.cwd())
  }
  
  if(emails.length === 0) {
    questions.push({
      name: 'email',
      message: 'Email?'
    })
  }
  
  prompt(questions, function (answers) {
    if(answers['dirName']) {
      dirName = answers['dirName']
      dir = path.join(process.cwd(), dirName)
    }
    emails = emails || [answers.email]
    
    // Determine the ID of the most recently issued badge
    var files = fs.readdirSync(dir)  
    var maxId = files.reduce(function (acc, file) {
      if(!file.match(/\d+\.json/)) return acc
      var number = parseInt(file)
      return number > acc ? number : acc
    }, 0)
    
    
    var classPath = path.join(dir, 'class.json')
    if(fs.existsSync(classPath)) {
      var badgeClass = require(classPath)
    } else {
      console.error('No class.json found. First add this to your badge directory.')
      process.exit()
    }
    
    emails.forEach(function (email, index) {
      var receiverId = maxId + index + 1
      var receiver = {}

      receiver.recipient = { type: 'email' }
      receiver.recipient.hashed = answers.hashed

      if(shouldHash) {
        var salt = crypto.randomBytes(16).toString('base64')
        receiver.recipient.salt = salt
        console.log('Hashing with salt ' + salt)
        receiver.recipient.identity = hash(email, salt, 'sha256')
      } else {
        receiver.recipient.identity = email
      }
      receiver.issuedOn = new Date().toISOString()

      receiver.verify = { type: 'hosted' }
      var filename =  receiverId + '.json'
      receiver.verify.url = urljoin(issuer.url, dirName, filename)
      receiver.uid = dirName + '#' + receiverId
      receiver.badge = urljoin(issuer.url, dirName, 'class.json')
      helper.writeJSON(path.join(dir, filename), receiver)
    })
    

  })
}
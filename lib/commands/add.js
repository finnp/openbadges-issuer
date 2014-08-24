var path = require('path')
var crypto = require('crypto');
var fs = require('fs')
var urljoin = require('url-join')
var hash = require('dollar-hash')
var split = require('split')

var helper = require('../helper.js')

module.exports = function (opts) {
  opts.path = path.resolve(opts.path)
  var root = helper.determineIssuerRoot(opts.path)
  var issuer = require(path.join(root, 'issuer.json'))
  var emails = opts.email || []
  var shouldHash = !opts.nohash
  
  var dir, dirName
  if(!path.relative(root, opts.path)) {
    // in Badges root folder
    var files = fs.readdirSync(root)
    files = files.filter(function (file) {
      var isDir = fs.statSync(file).isDirectory()
      return isDir && fs.existsSync(path.join(file, 'class.json'))
    })
    if(files.length === 0) {
      console.error('No badges found. Add one with `issuer class`')
      process.exit()
    } else {
      console.log('To issue a badge cd to one of this directories or use --path:')
      console.log('- ' + files.join('\n- '))
      process.exit()
    }
  } else {
    // in specific badge folder
    if(!fs.existsSync(path.join(opts.path, 'class.json'))) {
      console.error('Not in a badge directory, no class.json found.')
      process.exit()
    }
    dir = opts.path
    dirName = path.basename(opts.path)
  }

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
  
  if(emails.length === 0) {
    console.error('No email adresses specified, reading from stdin, end with ^C')
    var count = 0
    process.stdin
      .pipe(split())
      .on('data', function (email) {
        if(email.length === 0) return
        if(email.indexOf('@') > -1) {
          createBadge(email, maxId + 1 + count++)
        } else {
          console.error('Email does not contain an @')
        }
      })
  } else {
    emails.forEach(function (email, index) {
      createBadge(email, maxId + index + 1)
    })
  }
  
  function createBadge(email, receiverId) {
    var receiver = {}

    receiver.recipient = { type: 'email' }
    receiver.recipient.hashed = shouldHash

    if(shouldHash) {
      var salt = crypto.randomBytes(16).toString('base64')
      receiver.recipient.salt = salt
      console.error('Hashing with salt ' + salt)
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
    console.log(email + ',' + filename)
    helper.writeJSON(path.join(dir, filename), receiver)
  }
}


var path = require('path')
var fs = require('fs')
var urljoin = require('url-join')
var prompt = require('sync-prompt').prompt
var dateFormat = require('iso8601').fromDate

var helper = require('../helper.js')

module.exports = function () {
  var root = helper.determineIssuerRoot()
  var issuer = require(path.join(root, 'issuer.json'))
  
  var dir, dirName
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
    dirName = 'badge-' + prompt('Directory? badge-')
    dir = path.join(process.cwd(), dirName)
  } else {
    if(path.basename(process.cwd()).slice(0,6) !== 'badge-') {
      console.error('Not in a badge directory')
      process.exit()
    }
    dir = process.cwd()
    dirName = path.basename(process.cwd())
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
  var receiverId = maxId + 1
  receiver.uid = dirName + '#' + receiverId
  console.log('Reiceiver ID ' + receiverId)
  receiver.recipient = {
    type: 'email',
    hashed: false
  }
  receiver.recipient.identity = prompt('Email? ')
  receiver.issuedOn = dateFormat(new Date())
  receiver.badge = urljoin(issuer.url, dirName, 'class.json')
  receiver.verify = {
    type: 'hosted'
  }
  var filename =  receiverId + '.json'
  receiver.verify.url = urljoin(issuer.url, dirName, filename)
  
  helper.writeJSON(path.join(dir, filename), receiver)
}

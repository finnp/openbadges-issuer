var resolve = require('url').resolve
var path = require('path')
var fs = require('fs')
var prompt = require('sync-prompt').prompt

var helper = require('../helper.js')

module.exports = function () {
  var root = helper.determineIssuerRoot()
  
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
  
  helper.writeJSON(path.join(dir, 'class.json'), badgeClass)
}

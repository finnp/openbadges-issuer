var path = require('path')
var fs = require('fs')
var urljoin = require('url-join')
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
  badgeClass.image = urljoin(issuer.url, dirName, 'badge.png')
  console.log('Image: ' + badgeClass.image)

  // the criteria should also be  created by the tool
  // maybe it should ask for a file or create it
  var criteria = prompt('Criteria? ' + urljoin(issuer.url, dirName))
  badgeClass.criteria = urljoin(issuer.url, dirName, criteria)

  badgeClass.issuer = urljoin(issuer.url, 'issuer.json')
  console.log('Issuer: ' + badgeClass.issuer)  
  
  helper.writeJSON(path.join(dir, 'class.json'), badgeClass)
}

var path = require('path')
var fs = require('fs')
var urljoin = require('url-join')
var prompt = require('inquirer').prompt
var slug = require('slug')

var helper = require('../helper.js')

module.exports = function () {
  var root = helper.determineIssuerRoot()
  
  var issuer = require(path.join(root, 'issuer.json'))
  
  var questions = [
    {
      name: 'name',
      message: 'Name of the badge'
    },
    {
      name: 'description',
      message: 'Description'
    },
    {
      name: 'image',
      default: 'badge.png',
      message: 'Image file'
    },
    {
      name: 'criteria',
      default: 'criteria.txt',
      message: 'Criteria file'
    }
  ]
  
  prompt(questions, function (answers) {
    // create subdirectory for class
    var dirName = slug(answers.name).toLowerCase()
    var dir = path.join(root, dirName)
    fs.mkdirSync(dir)
    
    var badgeClass = {}
    badgeClass.name = answers.name
    badgeClass.description = answers.description
    badgeClass.image = urljoin(issuer.url, dirName, answers.image)

    var criteria = answers.criteria
    badgeClass.criteria = urljoin(issuer.url, dirName, criteria)

    badgeClass.issuer = urljoin(issuer.url, 'issuer.json')
    
    helper.writeJSON(path.join(dir, 'class.json'), badgeClass)
  })
}

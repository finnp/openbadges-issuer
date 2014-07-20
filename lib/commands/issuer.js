var path = require('path')
var prompt = require('inquirer').prompt
var ghslug = require('github-slug')

var helper = require('../helper.js')

module.exports = function () {  
  var questions = [
    {
      name: 'name',
      message: 'Issuer name'
    }
  ]
  
  ghslug('./', function (err, slug) {
    var rootQ = {
      name: 'url',
      message: 'Root Url'
    }  
    if(!err && slug) {
      // github pages default
      var gh = slug.split('/')
      rootQ.default = 'http://' + gh[0] + '.github.io/' + gh[1]
    }
    questions.push(rootQ)
    
    prompt(questions, function (issuer) {
      helper.writeJSON(path.join(process.cwd(), 'issuer.json'), issuer)
    })
  })
}
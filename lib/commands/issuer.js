var path = require('path')
var prompt = require('inquirer').prompt

var helper = require('../helper.js')

module.exports = function () {
  var questions = [
    {
      name: 'name',
      message: 'Issuer name'
    },
    {
      name: 'url',
      message: 'Root Url'
    }
  ]
  
  prompt(questions, function (issuer) {
    helper.writeJSON(path.join(process.cwd(), 'issuer.json'), issuer)
  })
}
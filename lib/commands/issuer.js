var path = require('path')
var prompt = require('sync-prompt').prompt

var helper = require('../helper.js')

module.exports = function () {
  var issuer = {}
  // issuer.json
  issuer.name = prompt('Issuer Name? ')
  issuer.url = prompt('Root url? ')
  
  helper.writeJSON(path.join(process.cwd(), 'issuer.json'), issuer)
}
var path = require('path')
var fs = require('fs')

exports.determineIssuerRoot = function () {
  if(fs.existsSync('./issuer.json'))
    return process.cwd()
  if(fs.existsSync('../issuer.json'))
    return path.normalize(path.join(process.cwd(), '..'))
  console.error('No root directory found. Please add an issuer.json first.')
  process.exit()
}

exports.writeJSON = function (writePath, json) {
  console.log('Writing ' + path.basename(writePath) + '...')
  fs.writeFileSync(writePath, JSON.stringify(json, null, '  '))
  console.log('Done.')
}
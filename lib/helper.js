var path = require('path')
var fs = require('fs')

exports.determineIssuerRoot = function (dir) {
  if(fs.existsSync(path.join(dir,'issuer.json')))
    return dir
  if(fs.existsSync(path.join(dir, '..', 'issuer.json')))
    return path.normalize(path.join(dir, '..'))
  console.error('No root directory found. Please add an issuer.json first.')
  process.exit()
}

exports.writeJSON = function (writePath, json) {
  console.error('Writing ' + path.basename(writePath) + '...')
  fs.writeFileSync(writePath, JSON.stringify(json, null, '  '))
  console.error('Done.')
}
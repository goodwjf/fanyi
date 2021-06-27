const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')
const {run} = require('./run.js')

exports.t = function(src, dist) {
  packageJson.inputFile = path.resolve(src)
  packageJson.outputDir = path.resolve(dist)
  //同步写入package.json文件
  fs.writeFile(path.resolve(__dirname, '../package.json'), JSON.stringify(packageJson,null,2), () => {
    run()
  })
}
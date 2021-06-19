const path = require('path')
const fs = require('fs')
const { inputFile, outputDir } = require('../package.json')

function getInput() {
  return require(inputFile ? path.resolve(inputFile) : '../lang/zh.js')
}

function getOutputDir() {
  return outputDir ? path.resolve(outputDir) : path.resolve(`./dist/`)
}

function output(obj, fileName, cb) {
  let contentStr = JSON.stringify(obj, null, 1)
  contentStr = `module.exports = ${contentStr}`  
  
  let dir = getOutputDir()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
  }

  console.log('path: ',`${dir}/${fileName}.js`)
  fs.writeFileSync(`${dir}/${fileName}.js`, contentStr)
  cb && cb()
}

module.exports  = {
  output,
  getInput,
  getOutputDir
}
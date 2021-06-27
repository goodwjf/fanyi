const path = require('path')
const fs = require('fs')
const { inputFile, outputDir } = require('../package.json')
const dirName = 'dist'
const historyFile = "._history"
function getRP(f) {
  return path.resolve(f) 
}
function getInputPath() {
  return inputFile ? getRP(inputFile) : getRP('./lang/zh.js')
}

function getOutputDir() {
  return outputDir ? getRP(outputDir) : getRP(`./${dirName}/`)
}

function output(obj, fileName, cb) {
  let dir = getOutputDir()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
  }  
  let outFile = `${dir}/${fileName}.js`
  console.log('The output file: ',`${outFile}`)
  if (fs.existsSync(outFile)) {
    appendContent(obj, outFile, cb)
  } else {
    writeFile(obj, outFile, cb)
  }
}

function creatHistory() {
  let src = getInputPath()
  let dest = `${getOutputDir()}/${historyFile}`
  fs.copyFileSync(src, dest);
  console.warn(new Date(),'Update translation record');
}

function getOldKeys() {
  // 如果是全量替换 直接返回
  if (process.argv.slice(3)[0] === 'a') {
    return []
  }
  let arr = []
  let _path = getOutputDir()
  if (_path) {
    _path = `${_path}/${historyFile}`
    if (fs.existsSync(_path)) {
      let _zh = require(_path)
      arr = Array.isArray(_zh) ? _zh : Object.keys(_zh)
    }
  }
  return arr
} 

function appendContent(obj, outFile, cb) {
  let enFile = require(outFile)
  writeFile({...obj, ...enFile}, outFile, cb) 
}

function writeFile(obj, outFile, cb) {
  let contentStr = JSON.stringify(obj, null, 1)
  contentStr = `module.exports = ${contentStr}` 
  fs.writeFileSync(`${outFile}`, contentStr)
  cb && cb()
}

function diff(newKeys) {
  const oldKeys = getOldKeys()
  if (!oldKeys.length) {
    return newKeys
  }
  return newKeys.filter(v => !oldKeys.includes(v))
}

module.exports  = {
  getRP,
  diff,
  output,
  getInputPath,
  getOutputDir,
  creatHistory
}
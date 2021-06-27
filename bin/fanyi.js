#!/usr/bin/env node

// const program = require('commander')
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')
const fanyi = require('../src/watch.js')
const MSG = [
  'Please enter the file you want to monitor. Changes to this file will automatically trigger translation:',
  'This item cannot be blank!',
  'Please enter the output file directory after translation:',
]

const promptList = [{
  type: 'input',
  message: MSG[0],
  name: 'src',
  validate: function(val) {
    if(!val) {
        return MSG[1];
    }
    return true;
}

},{
  type: 'input',
  message: MSG[2],
  name: 'dist',
  default: "./dist"  

}]

inquirer.prompt(promptList).then(answers => {
  let {src, dist} = answers
  packageJson.inputFile = path.resolve(src)
  packageJson.outputDir = path.resolve(dist)
  //同步写入package.json文件
  fs.writeFile(path.resolve(__dirname, '../package.json'), JSON.stringify(packageJson,null,2), () => {
    fanyi.watch()
    console.warn('watching...')
  })
})
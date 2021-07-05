const fs = require('fs')
const path = require('path')
const { tJSON } = require('./custom.js')
let zh = require('../lang/zh.js')

// let zh = require('../lang/new.json')

// let zh = require('../lang/static/zh.js')
// try {
//   fs.writeFileSync(path.resolve( __dirname, '../lang/new.json'), JSON.stringify(zh), 'utf-8')
//   zh = fs.readFileSync(path.resolve( __dirname, '../lang/new.json'), 'utf-8');
//   let re = /\$\{(\w+)\}/gm
//   let re2 = /\{\{(\w+)\}\}/gm
//   let re3 = /“([^"]*)”/gm 

//   zh = zh.replace(re, "!## " + "$1" + " ##!")
//   zh = zh.replace(re2, "@## " + "$1" + " ##@")
//   zh = zh.replace(re3, '###' + '$1' + '###');
//   zh.replace("`", "'")

//   console.log(zh)
// } catch (err) {
//   console.log('----------err------------',err)
// }



tJSON(zh, {from: 'zh', to: 'en'} ,(data) => {
  console.log('ok👌')
  fs.writeFileSync(path.resolve( __dirname, '../lang/dist.json'), JSON.stringify(data), 'utf-8')
  //console.log(JSON.stringify(data))
})

// 踩坑结论：
// Google翻译 zh -> en 针对 Json（String) 翻译会有破坏性
// 会吧中文 “” | '' 翻译成英文 ""  ,
// 会吧1万 翻译成 -> 10,000 （带英文逗号）
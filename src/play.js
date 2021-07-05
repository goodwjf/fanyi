const { tJSON } = require('./custom.js')
const zh = require('../lang/zh.js')

tJSON(zh, {from: 'zh', to: 'vie'} ,(data) => {
  console.log(JSON.stringify(data))
})

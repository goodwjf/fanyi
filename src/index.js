const fy = require('./translate.js')
const { getInputPath, output, diff, creatHistory } = require('./io.js')
const { codeList } = require('./config.js')

let lang = {}
let counter = 0

function getKeysStr() {
  let zh = require(getInputPath())
  let keys = Array.isArray(zh) ? zh : Object.keys(zh)
  keys = diff(keys)
  
  console.warn(new Date(), `Newly added [ ${keys.length} ] translation`);
  return (keys.length > 0) ? keys.join('\n') : ''
}

async function t(_code) {
  return new Promise((resolve, reject) => {
    let keysStr = getKeysStr()
    if (!keysStr){
      reject()
    }
    try {
      setTimeout(()=>{
        fy.setLang({
          from: 'zh',
          to: _code
        })
        fy.translate(keysStr, function(res) {
          // console.log(res)
          res.forEach(({src, dst}) => {
            if (_code === 'en') {
              dst = dst.charAt(0).toUpperCase() + dst.slice(1)
            }
            lang[src] = dst
          })
          resolve(_code)
        })
      },100)
    } catch (error) {
      reject(error)
    }
  }).then(() => {
    let l = Object.keys(lang)
    output(lang, _code, ()=>{
      lang = {}
    })
    return _code
  })
}

async function run() {
  // # 并发请求 会遭到百度拒绝
  // # 产生报错：54005 	 长query请求频繁  请降低长query的发送频率，3s后再试 
  // let pAll = []
  // codeList.forEach(((code)=>{
  //   pAll.push(t(code))
  // }))
  // Promise.all(pAll).then(function() {
  //     process.exit(0);
  // })

  // # 错误异步遍历的写法
  // codeList.forEach(((code)=>{
  //    let c = await t(code)
  //    console.log(c)
  // }))

  // # 绕过百度提示长query的发送频率，3s后再试 ，用队列的方式解决 排队一个一个来请求
  const len = codeList.length
  try {
    for (let i = 0; i < len; i++) {
      let c = await t(codeList[i])
      console.warn(new Date(),`${c}.js translation done`)
      if(++counter === len) {
        console.warn(new Date(),'Completion of program')
        creatHistory()
        process.exit(0)
      }
    }
  } catch (error) {
    console.warn(new Date(),'No translation added')
    process.exit(0)
  }

}
run()
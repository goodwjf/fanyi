const fy = require('./translate.js')
const { getInputPath, getRP, output, diff, creatHistory } = require('./io.js')
const { codeList } = require('./config.js')

const one_group = 500;
let lang = {}
let counter = 0
let keys = []
// 初始化分组
let num = 1
// 翻译进度初始值
let N = 0


// 求百分比
// _num 当前数
//_total 总数
function getPercent(_num, _total) {
  _num = parseFloat(_num);
  _total = parseFloat(_total);
  if (isNaN(_num) || isNaN(_total)) {
      return "-";
  }
  return _total <= 0 ? "0%" : (Math.round(_num / _total * 10000) / 100.00)+"%";
}

function init() {
  
  // 获取需要翻译的字段
  function getKeys() {
    try {
    let zh = require(getInputPath())
    let keys = Array.isArray(zh) ? zh : Object.keys(zh)
    keys = Array.from(new Set(keys))
    keys = diff(keys)
    
    console.warn(new Date(), `Newly added [ ${keys.length} ] translation`);
    return  keys
    } catch(e) {
      console.log('Function getKeys', e)
    }
  }

  // 计算分组
  function GroupNumber(keys) {
    let count = keys.length
    let n = count / one_group
    n = n > parseInt(n) ? parseInt(n) + 1 : n
    return n;
  }
  // keys是指中文语言包 不用每次取 取一次就可以
  keys = getKeys()
  // 分组 基于keys 执行一次即可
  num = GroupNumber(keys)
}

// 分组排队执行
async function batch(fn) {
  async function _proxy(_keys) {
    try {
      return new Promise((resolve, reject) => {
        fn && fn(_keys, () => {
          resolve()
          num = 1
        })
      })  
    } catch (error) {
      reject()
    }
  }

  for (let i = 0; i < num; i++) {
    let from = i * one_group
    let to = from + one_group
    await _proxy(keys.slice(from, to))
  }
  return Promise.resolve()
}

// 按语言分组执行
async function t(_code) {
  return new Promise((resolve, reject) => {
    if (keys.length === 0){
      reject()
    }
    try {
      //setTimeout(()=>{
        fy.setLang({
          from: 'zh',
          to: _code
        })
        batch((_keys, cb) => {
          fy.translate(_keys.join('\n'), function(res) {
            // console.log(res)
            // 当前语言翻译进度
            console.log(`batch [ ${_code} ]----------------------`, getPercent(++N, num))
            res.forEach(({src, dst}) => {
              
              if (_code === 'en') {
                dst = dst.charAt(0).toUpperCase() + dst.slice(1)
              }
              lang[src] = dst
              cb && cb()
            })
          })
        }).then(function(i) {
          resolve(_code)
        })
      //},100)
    } catch (error) {
      reject(error)
    }
  }).then(() => {
    // 初始当前语言翻译进度
    N = 0
    console.log(`[${_code}] append word quantity: `, ` ${Object.keys(lang).length} `)
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
  init()
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

module.exports = {
  run
}
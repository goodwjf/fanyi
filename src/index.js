const fy = require('./translate.js')
const { getInput, output } = require('./io.js')
const { code } = require('./config.js')

const lang = {}
const keys = Object.keys(getInput())
//console.log(keys) 
// keys 作为Get请求参数 总长度 14433 （2000+字段）
// chrome get请求参数最大 8182 所以考虑分组翻译
// 每次请求翻译500个字段
const one_group = 500;

function getGroupSize(keys) {
  let count = keys.length
  let n = count / one_group
  n = n > parseInt(n) ? parseInt(n) + 1 : n
  return n;
}

function t(_keys) {
  return new Promise(function(resolve, reject) {
    try {
      let _lang = {}
      fy.translate(_keys, function(res) {
        // console.log(res)
        res.forEach(({src, dst}) => {
          if (code === 'en') {
            dst = dst.charAt(0).toUpperCase() + dst.slice(1)
          }
          lang[src] = dst
          _lang[src] = dst
          
        });
        resolve(_lang)
      })
    } catch (error) {
      reject(error)
    }
  })
}

function run() {
  fy.setLang({
    from: 'zh',
    to: code
  })

  let size = getGroupSize(keys)
  let pArr = []
  for (let i = 0; i < size; i++) {
    let from = i * one_group
    let to = from + one_group
    let p = t(keys.slice(from, to).join('\n'))
    pArr.push(p)
  }

  Promise.all(pArr).then(function(arr) {
    output(lang, code, () => {
      // console.log('size', size)
      process.exit(0);
    })
  })
}

run()
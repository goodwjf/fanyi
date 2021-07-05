// 解决中文字典里 中英文key 不统一的问题
// 统一处理成中文key
function conversion (obj) {
  let re = /[\u4e00-\u9fa5]/gm
  for (const key in obj) {
    var val = obj[key]
    if (!re.test(key) && re.test(val)) {
      obj[val] = key      
      delete obj[key]
    }
    if (Object.prototype.toString.call(val) === '[object Object]') {
      conversion(val)
    }
  }
  console.log(obj)
}

// 处理 json对象 入参翻译，返回的数据对象 中文key 也被翻译的问题
// 直接解析出中文key 的json 对象 （支持 对象深度）
function merge (_src, _des) {

  let valArr = []

  function run (obj, fn) {
    for (const key in obj) {
      let val = obj[key]
      if (Object.prototype.toString.call(val) === '[object Object]') {
        run(val, fn)
      } else {
        fn && fn(obj, key)
      }
    }
  }
 
  run(_des, (obj, key) => {
    valArr.push(obj[key])
  })
  
  //console.log(valArr)
  
  run(_src, (obj, key) => {
    obj[key] = valArr.shift()
  })
  
  //console.log(JSON.stringify(_src))

  return _src
}

module.exports = {
  merge,
  conversion
}

// const en = {
//   "baccarat on site": "baccarat on site",
//   "baccarat insurance": "baccarat insurance",
//   "baccarat Longbao": "baccarat Longbao",
//   "activity": {
//    "NAV": {
//     "all": "VIP",
//     "newbie": "new hand bonus",
//     "topic": "special bonus",
//     "regular": "regular bonus",
//     "time limited": "time limited bonus"
//    },
//    "tag": {
//     "all": "VIP",
//     "newbie": "novice",
//     "topic": "special topic"
//    },
//    "Regular": "regular",
//    "timelimited": "limited time"
//   },
//   "immediateregistration": "immediate registration",
//   "totalmoney": "total balance",
//   "accountbalance": "account balance",
//   "selfwashingcount": "washable amount",
//   "historytitle": "history",
// }

// const cn = {
//   message: {
//     '现场百家乐': '现场百家乐',
//     '保险百家乐': '保险百家乐',
//     '龙宝百家乐': '龙宝百家乐',
//     activity: {
//         nav: {
//           all: '全部',
//           vip: 'VIP红利',
//           newbie: '新手红利',
//           topic: '专题红利',
//           regular: '常规红利',
//           timeLimited: '限时红利'
//         },
//         tag: {
//           all: '全部',
//           vip: 'VIP',
//           newbie: '新手',
//           topic: '专题',
//           regular: '常规',
//           timeLimited: '限时'
//         }
//     },
//     immediateRegistration: '立即注册',
//     totalMoney: '总余额',
//     accountBalance: '账户余额',
//     selfWashingCount: '可洗码金额',
//     historyTitle: '历史记录', 
//   }
// }
// //conversion(cn)
// module.exports = {
//   conversion,
//   merge
// }

// merge (cn, en)


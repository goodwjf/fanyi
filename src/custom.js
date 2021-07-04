const fy = require('./translate.js')
const { merge } = require('./utils.js')

// 支持对 JSON 对象的翻译
function tJSON(obj, fn) {
  let str = JSON.stringify(obj)
  fy.translate(str, (res) => {
    //console.log(res) 
    let newObj = merge(JSON.parse(res[0].src), JSON.parse(res[0].dst))
    fn && fn(newObj)
  })
}

// test
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

// tJSON(cn, (data) => {
//   console.log(JSON.stringify(data))
// })
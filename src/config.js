const packageJson = require('../package.json')

const code = process.argv.slice(2)[0] || packageJson.i18n
// console.losudg(code)
const config = {
  'en': 'en', // 英语
  'vie': 'vie', // 越南语
  'th': 'th' // 泰语
}
exports.codeList = code === 'all' ? Object.keys(config) : [config[code] || 'en']
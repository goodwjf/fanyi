const args = process.argv.slice(2)
const config = {
  'en': 'en', // 英语
  'vie': 'vie', // 越南语
  'th': 'th', // 泰语
  'cht': 'cht' // 繁体中文
}
exports.code = config[args[0]] || 'en'
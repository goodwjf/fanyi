const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec;

const watch = function () {
  // 注意等 watch的时候再去加载package.json 避免watch前被修改 
  // 知识点 
  // 1、CommonJS输出是值的拷贝, 
  // 2、第一次加载某个模块时，Node 会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的module.exports属性。
  delete require.cache[require.resolve('../package.json')];
  const { inputFile } = require('../package.json')
  const dir = inputFile ? path.resolve(inputFile) : path.resolve(__dirname, "../lang")
  const _fileName = path.basename(inputFile)

  fs.watch(dir, (event, filename) => {
    if (filename === _fileName && event === "change") {
      // console.log(`${filename} file Changed`);
      const cmdStr = `node ${path.resolve(__dirname,'main.js')} all`
      console.log('run:' + cmdStr)
      // 知识点：操作场景已经移出当前项目 下面👇命令 会执行失败 
      // 原因 ：npm run 执行的是package.json 里定义的script 脚本
      // const cmdStr = 'npm run t all';
      console.log(inputFile, ' file Changed')
      exec(cmdStr, (err, stdout, stderr) => {
          if (err){
              console.log(err);
              console.warn(new Date(),' execution failed');
          } else {
              console.log(stdout);
              console.warn(new Date(),'execution succeed');
              console.warn('stderr: ' + stderr);
              console.log('watching...')
          }

      })
    }
  })
}

module.exports = { watch }
//watch()

// const s = `node ${path.resolve(__dirname,'index.js')} all`
// console.log(s)
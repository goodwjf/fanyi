### 使用说明


把要翻译的中文语言包替换 lang/zh.js
通过 `npm run t [语种]` 指定翻译的语言类型
翻译成功后会生成 dist/[语种].js

### 命令

```javascript
# 安装依赖
npm install

# 基于中文翻译 
# npm run t [en | vie | th | cht | all] （备注： all 会翻译列出的所有的语言）比如：

npm run t en

# 监控词典变化自动增量翻译
npm run watch
```

### 高级用法
如果不喜欢通过覆盖zh.js的方式进行翻译，可以选择在package.json里配置相关字段如下：

```json
# 指定zh.js所在的相对路径
 "inputFile": "../[项目目录]/src/i18n/zh.js",

 # 指定翻译后输出的文件目录
  "outputDir": "../[项目目录]/src/i18n/test",
```


参考： http://api.fanyi.baidu.com/doc/21
const https = require('https');
const queryString = require('querystring');
const md5 = require('md5');

const errorMap = {
  52003: '用户认证失败',
  54001: '签名错误',
  54004: '账户余额不足',
};

let option = {
  from: 'zh',
  to: 'en'
}
function setLang(opt) {
  option = Object.assign({}, option, opt)
}

function translate(q, fn) {
  const salt = Math.random();
  const appid = '20210320000735744';
  const appSecret = 'r8zOD7lNfOTkcByxpbPC';
  const sign = md5(appid + q + salt + appSecret);
  const from = option.from;  
  const to = option.to;
  
  //query 长度：为保证翻译质量，请将单次请求长度控制在 6000 bytes以内（汉字约为输入参数 2000 个）
  const query = queryString.stringify({
    q,
    appid,
    from,
    to,
    salt,
    sign,
  });

  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: `/api/trans/vip/translate`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const object = JSON.parse(string);
      if (object.error_code) {
        console.error(errorMap[object.error_code] || object.error_msg);
        console.log('编译错误');
        process.exit(2);
      } else {
        // object.trans_result.map((obj) => {
        //   console.log(11, obj.dst);
        // });
        fn && fn(object.trans_result);
        //process.exit(0);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.write(query);
  request.end();
}

module.exports = {
  translate,
  setLang
}
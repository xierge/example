/*
 * @Date: 2023-05-29 18:38:09
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-30 16:01:40
 * @FilePath: /example/node/express/index.js
 * @description:
 */
const express = require("express");

const request = require("./request");

const app = express();

const REG_COMMON_HREF = /href\=\"(.+)html/;

app.get("/", async (req, res) => {
  const list = await getTypeTagList("lagou-course");
  const promises = list.slice(0, 1).map((postid) => {
    return getUrl(postid);
  });
  const url = await Promise.all(promises);
  res.send(url);
});

const getUrl = async (postid) => {
  const code = await getCode(postid);
  const { data } = await request.get(
    `https://www.itdjs.com/wp-content/plugins/erphpdown/download.php?postid=${postid}&&key=1`
  );
  let reg = /location\=\'(.+)\'/;
  reg.test(data);
  let url = RegExp.$1 + `?pwd=${code}`;
  return url;
};

const getTypeTagList = async (type) => {
  const { data } = await request.get(`https://www.itdjs.com/tag/${type}`);
  let reg = /\<a href\=\"(.+)\"/g;
  return data
    .match(reg)
    .filter((item) => item.includes("html") && item.includes("title"))
    .map((item) => item.match(REG_COMMON_HREF)[1].match(/[0-9]{1,20}/)[0]);
};

const getCode = async (postid) => {
  const { data } = await request.get(
    `https://www.itdjs.com/wp-content/plugins/erphpdown/download.php?postid=${postid}`
  );

  return data.match(/\>\w{4}\</)[0].substr(1, 4);
};

app.listen(3000, () => {
  console.log("server is start");
});

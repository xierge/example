/*
 * @Author       : 李鹏玺 2899952565@qq.com
 * @Date         : 2023-05-22 10:42:24
 * @LastEditors  : 李鹏玺 2899952565@qq.com
 * @LastEditTime : 2023-05-22 16:56:26
 * @FilePath     : /utils/控制请求并发数函数.js
 * @Description  : 控制请求并发数函数
 */

function createReq(timer = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(timer);
    }, timer * 1000);
  });
}

const reqList = [
  () => createReq(1),
  () => createReq(2),
  () => createReq(3),
  () => createReq(4),
  () => createReq(5),
  () => createReq(6),
  () => createReq(7),
];

/**
 * @description: 控制请求并发数函数
 * @param {*} requestList 请求列表
 * @param {*} limit 限制最大并发数
 * @param {*} callback 全部请求完后的回调
 * @return {*}
 */
function limitReq(requestList = [], limit = 3, callback) {
  console.time("start");
  const queue = [];
  const success = [];
  const fail = [];
  for (let i = 0; i < limit; i++) {
    createTask();
  }
  walker();
  function walker() {
    queue
      .filter((q) => q.isStart === false)
      .forEach((item, index) => {
        item
          .then((res) => {
            success.push(res);
          })
          .catch((err) => {
            fail.push(err);
          })
          .finally(() => {
            queue.splice(index, 1);
            queue.forEach((q) => (q.isStart = true));
            if (requestList.length) {
              createTask();
              walker();
            } else {
              queue.length === 0 && callback && callback(success, fail);
            }
          });
      });
  }
  function createTask() {
    requestList.length &&
      queue.push({ isStart: false, req: requestList.shift() });
  }
}

function cb(success, fail) {
  console.timeEnd("start");

  console.log(success, fail);
}

limitReq(reqList, 3, cb);

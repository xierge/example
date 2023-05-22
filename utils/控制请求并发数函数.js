/*
 * @Author       : 李鹏玺 2899952565@qq.com
 * @Date         : 2023-05-22 10:42:24
 * @LastEditors  : 李鹏玺 2899952565@qq.com
 * @LastEditTime : 2023-05-22 17:20:00
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
  const queue = requestList.splice(0, limit);
  const success = [];
  const fail = [];

  walker(queue);

  function walker(tasks) {
    tasks.forEach((item, index) => {
      item()
        .then((res) => {
          success.push(res);
        })
        .catch((err) => {
          fail.push(err);
        })
        .finally(() => {
          queue.splice(index, 1);
          if (requestList.length) {
            walker([createTask()] || []);
          } else {
            queue.length === 0 && callback && callback(success, fail);
          }
        });
    });
  }

  function createTask() {
    return (
      requestList.length && queue.push(requestList.shift()) && queue[limit - 1]
    );
  }
}

function cb(success, fail) {
  console.timeEnd("start");

  console.log(success, fail);
}

limitReq(reqList, 3, cb);

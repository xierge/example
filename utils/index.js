/*
 * @Author       : 李鹏玺 2899952565@qq.com
 * @Date         : 2023-05-23 15:39:18
 * @LastEditors  : 李鹏玺 2899952565@qq.com
 * @LastEditTime : 2023-05-23 18:07:01
 * @FilePath     : /utils/index.js
 * @Description  : 兼容sort
 */

// origin_code
{
  const isFirefox = navigator.userAgent.includes("Firefox");
  if (isFirefox) Array.prototype.sort = sort;

  function sort(fn) {
    if (typeof fn !== "function") fn = (a, b) => a - b;

    const arr = JSON.parse(JSON.stringify(this));
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (fn(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

// test
{
  let arr = [1, 2, 3, 4, 2, 1, 3, 4];

  const res = arr.sort();

  console.log(res);
}

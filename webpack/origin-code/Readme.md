### webpack 编译后代码的函数

\_\_webpack_require\_\_: 根据路径 ID 加载相应模块，获取文件的 module.exports 的内容

installedModules / \_\_webpack_module_cache\_\_：缓存已经加载的模块

\_\_webpack_require\_\_.o: 判断对象中是否有此属性

\_\_webpack_require\_\_.r: 通过 Object.defineProperty 设置 Symbol.toStringTag 将 exports 导出的内容设置为 Module 类型，新增 \_\_esModule 属性并且设置为 true

\_\_webpack_require\_\_.n: 根据 about.js 的模块类型返回不同的值，若 \_\_esModule 为 true,将 exports 新增的值为 module.default 的值，否则新增的值为 module 的值

\_\_webpack_require\_\_.d: 为 exports 追加一些属性的 getter

### commonjs 引入 commonjs

```
module.exports = "about";
```

```
const about = require("./about")
```

执行入口文件 => \_\_webpack\_\_require 加载 about.js 文件

### commonjs 引入 esModule

```
export default "about";
```

```
const about = require("./about").default;
```

执行入口文件 => \_\_webpack\_\_require 加载 about.js 文件 => 执行 \_\_webpack_require\_\_.r 函数, 标记为 \_\_esModule => 执行 \_\_webpack_require\_\_.d 函数,新增 exports.default

### esModule 引入 commonjs

```
module.exports = "about";
```

```
import about from "./about";
```

执行入口文件 => 执行 \_\_webpack_require\_\_.r 函数, 将入口文件标记为 \_\_esModule => \_\_webpack\_\_require 加载 about.js 文件 => 执行 \_\_webpack_require\_\_.n 根据 about.js 的模块类型返回不同的值，若\_\_esModule 为 true,将 exports 新增的值为 module.default 的值，否则新增的值为 module 的值 => 执行 \_\_webpack_require\_\_.d 函数,将 exports 新增相应属性的 getter

### esModule 引入 esModule

```
export default "about";
```

```
import about from "./about";
```

执行入口文件 => 执行 \_\_webpack_require\_\_.r 函数, 将入口文件标记为 \_\_esModule => \_\_webpack\_\_require 加载 about.js 文件 => 执行 \_\_webpack_require\_\_.r 函数, 标记为 \_\_esModule => 执行 \_\_webpack_require\_\_.d 函数,新增 exports.default

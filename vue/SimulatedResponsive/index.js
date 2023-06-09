/*
 * @Date: 2023-05-23 18:16:31
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-29 13:57:58
 * @FilePath: /example/vue/SimulatedResponsive/index.js
 * @description:
 */

// 1.将data数据通过_proxyData挂载到vue的实例上
// 2.通过Observer将data设置setter、getter
// 3.Compiler类根据元素的所有节点 渲染指令 和 文本渲染
// 4.Dep 类收集修改后需要更新的方法
// 5.Watcher类观察者

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data =
      (typeof this.$options.data === "function"
        ? this.$options.data()
        : this.$options.data) || {};

    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;

    // 将data数据挂载在实例上
    this._proxyData(this.$data);
    new Observer(this.$data);
    new Compiler(this);
  }

  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(val) {
          data[key] = val;
        },
      });
    });
  }
}

class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.options = vm.$options;
    this.vm = vm;
    this.compile(this.el);
  }

  compile(el) {
    const childNodes = el.childNodes;
    childNodes.forEach((node) => {
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }

      const _childNodes = node.childNodes;
      _childNodes && _childNodes.length & this.compile(node);
    });
  }

  compileText(node) {
    let reg = /\{\{(.+?)\}\}/;
    if (reg.test(node.textContent)) {
      let value = RegExp.$1.trim();
      node.textContent = this.options.data[value];
      new Watcher(this.vm, value, (newValue) => (node.textContent = newValue));
    }
  }
  compileElement(node) {
    [...node.attributes].forEach((attr) => {
      if (this.isDirective(attr)) {
        const name = attr.name.substr(2);
        const key = attr.value;
        this[name + "Updater"] &&
          this[name + "Updater"](node, this.options.data[key], key);
      }
    });
  }

  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (value) => (node.textContent = value));
  }

  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, (value) => (node.value = value));
    node.addEventListener("input", (e) => {
      this.vm[key] = e.target.value;
      console.log(this.vm[key]);
    });
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }

  isDirective(attrName) {
    return attrName.name.startsWith("v-");
  }
}

class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    if (!data || typeof data !== "object") return;
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(obj, key, val) {
    this.walk(val);
    let dep = new Dep();
    const self = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(value) {
        val = value;
        dep.notify();
        self.walk(val);
      },
    });
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    sub && sub.update && this.subs.push(sub);
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    Dep.target = this;
    this.oldValue = this.vm[key];
    Dep.target = null;
  }

  update() {
    let newValue = this.vm[this.key];
    this.callback(newValue);
  }
}

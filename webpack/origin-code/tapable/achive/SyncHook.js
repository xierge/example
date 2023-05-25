const Hook = require("./Hook");

const COMPILE = () => {};

class SyncHook extends Hook {
  constructor(args, name) {
    super(args, name);
  }
  compile: COMPILE;
}

function SyncHook() {
  const hook = new Hook();

  hook.compile = COMPILE;
  return hook;
}

const  { nodeResolve }  = require("@rollup/plugin-node-resolve") ;
const ts = require("rollup-plugin-typescript2")
const path = require("path")
export default {
  input: "src/index.ts",
  output: {
    file: path.resolve(__dirname, "dist/bundle.js"),
    format: "iife",
  },
  plugins: [
    ts({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    })
  ],
};

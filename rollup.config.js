import resolve from "@rollup/plugin-node-resolve"
import babel from "rollup-plugin-babel"
import { terser } from "rollup-plugin-terser"
import nodePolyfills from "rollup-plugin-polyfill-node"

export default {
  input: "src/index.js",
  output: [
    {
      file: "index.mjs",
      format: "es",

      plugins: [resolve(), terser(), babel(), nodePolyfills()],
    },
    {
      file: "index.js",
      format: "es",

      plugins: [resolve(), babel()],
    },
  ],
  external: ["axios"],
}

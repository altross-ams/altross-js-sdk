import resolve from "@rollup/plugin-node-resolve"
import babel from "rollup-plugin-babel"
import { terser } from "rollup-plugin-terser"
export default {
  input: "src/index.js",
  output: [
    {
      file: "index.mjs",
      format: "es",

      plugins: [resolve(), terser(), babel()],
    },
    {
      file: "index.js",
      format: "es",

      plugins: [resolve(), babel()],
    },
  ],
  external: ["http"],
}

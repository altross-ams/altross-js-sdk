import resolve from "@rollup/plugin-node-resolve"
import babel from "rollup-plugin-babel"
import { terser } from "rollup-plugin-terser"
export default {
  input: "index.js",
  output: [
    {
      file: "build/index.js",
      format: "es",
    },
  ],
  plugins: [resolve(), babel(), terser()],
}

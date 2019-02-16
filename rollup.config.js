import sourcemaps from 'rollup-plugin-sourcemaps'
import pkg from './package.json'

const globals = {
  'apollo-client': 'apollo.core',
  'lodash': 'lodash'
}

const config = {
  input: 'lib/index.js',
  output: {
    file: 'dist/bundle.umd.js',
    format: 'umd',
    globals,
    sourcemap: true,
    exports: 'named',
    name: pkg.name
  },
  external: Object.keys(globals),
  plugins: [sourcemaps()]
}

export default config

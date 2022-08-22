import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

import packageJson from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'react-lib'
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: [
          'src/setupTests.ts',
          'src/**/__test__/**'
        ]
      }),
      terser()
    ]
  },
  {
    input: 'dist/esm/declarations/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/],
    plugins: [
      dts(),
      del({ hook: 'buildEnd', targets: ['dist/cjs/declarations', 'dist/esm/declarations'] })
    ]
  }
]

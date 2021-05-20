import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default [
    // UMD
    {
        input: 'src/index.ts',
        output: {
            file: pkg.main,
            format: 'umd',
            name: '@magiczne/http-client',
            sourcemap: true
        },
        plugins: [
            typescript(),
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'runtime'
            }),
            terser()
        ]
    },

    // ESM
    {
        input: 'src/index.ts',
        output: {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            typescript(),
            resolve(),
            commonjs()
        ]
    }
]

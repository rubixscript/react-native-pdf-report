import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
      }),
    ],
    external: [
      'react',
      'react-native',
      'expo-linear-gradient',
      '@expo/vector-icons',
      '@react-native-community/datetimepicker',
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // Only generate in first build
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
      }),
    ],
    external: [
      'react',
      'react-native',
      'expo-linear-gradient',
      '@expo/vector-icons',
      '@react-native-community/datetimepicker',
    ],
  },
];
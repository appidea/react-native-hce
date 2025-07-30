const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: false }],
    ['@babel/plugin-transform-private-methods', { loose: false }],
    ['@babel/plugin-transform-private-property-in-object', { loose: false }],
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.ts',
          '.tsx',
          '.ios.js',
          '.ios.ts',
          '.android.js',
          '.android.ts',
          '.json',
        ],
        root: [path.join(__dirname, '..')],
        alias: {
          'react-native-hce': path.join(__dirname, '..'),
          // [pak.name]: path.join(__dirname, '..', pak.source),
        },
      },
    ],
  ],
};

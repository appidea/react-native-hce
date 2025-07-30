const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const pak = require('../package.json');
const blacklist = require('metro-config/src/defaults/exclusionList');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const extraNodeModules = {
  ...modules.reduce((acc, name) => {
    acc[name] = path.join(__dirname, 'node_modules', name);
    return acc;
  }, {}),
  'react-native-hce': path.join(__dirname, '..'),
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blacklistRE: blacklist(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      )
    ),

    extraNodeModules,
  },
  transformer: {
    babelTransformerPath: require.resolve(
      '@react-native/metro-babel-transformer'
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../node_modules'), // sometimes needed
  ],
  projectRoot: path.resolve('.'),
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

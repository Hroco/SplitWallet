const CracoEnvPlugin = require('craco-plugin-env')

module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Add SVG file handling rule
        webpackConfig.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });
  
        return webpackConfig;
      },
    },
    plugins: [
      {
        plugin: CracoEnvPlugin,
        options: {
          variables: {}
        }
      }
    ]
  };
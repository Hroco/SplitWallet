const CracoSwcPlugin = require('craco-swc');

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
      plugin: CracoSwcPlugin, // see .swcrc for SWC configuration (that will replace Babel)
    }, 
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {          
          const terser = webpackConfig?.optimization?.minimizer?.find(x => x.options.minimizer);
          if (terser) {
            terser.options.minimizer.options = {
              ...terser.options.minimizer.options,
              keep_classnames: true,
              keep_fnames: true,
            }
          }
          return webpackConfig;
        }
      }
    }
  ],
  babel: {
    presets: ['@babel/preset-react'],
    plugins: [
      [
        "babel-plugin-styled-components",
        {
          "displayName": true
        }
      ]
    ],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      console.log("BABEL");
      console.log(babelLoaderOptions);
      return babelLoaderOptions;
    },
  }
};
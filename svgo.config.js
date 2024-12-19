module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeUselessStrokeAndFill: false,
          cleanupNumericValues: {floatPrecision: 2},
        },
      },
    },
    'cleanupListOfValues',
    'convertStyleToAttrs',
    'removeElementsByAttr',
    'removeRasterImages',
    'removeStyleElement',
    'sortAttrs',
    'removeXMLNS',
    {
      name: 'removeAttrs',
      params: {
        attrs: 'class',
      },
    },
  ],
};

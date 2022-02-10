const config = require('./svgo.config');

module.exports = {
  ...config,
  plugins: config.plugins.concat({
    name: 'removeAttrs',
    params: {
      attrs: '.*:(fill|stroke):(black|#000)',
    },
  }),
};

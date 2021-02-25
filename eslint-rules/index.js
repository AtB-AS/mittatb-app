const translationsWarning = require('./translations-warning');
const importWarning = require('./import-warning');

module.exports = {
  rules: {
    ['translations-warning']: translationsWarning,
    ['import-warning']: importWarning,
  },
};

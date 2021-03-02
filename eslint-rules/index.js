const translationsWarning = require('./translations-warning');
const importWarning = require('./import-warning');
const avoidImports = require('./avoid-imports');

module.exports = {
  rules: {
    ['translations-warning']: translationsWarning,
    ['import-warning']: importWarning,
    ['avoid-imports']: avoidImports,
  },
};

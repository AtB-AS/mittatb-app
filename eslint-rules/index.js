const translationsWarning = require('./translations-warning');
const importWarning = require('./import-warning');
const avoidImports = require('./avoid-imports');
const navigationOnlyInScreens = require('./navigation-only-in-screens');

module.exports = {
  rules: {
    ['translations-warning']: translationsWarning,
    ['import-warning']: importWarning,
    ['avoid-imports']: avoidImports,
    ['navigation-only-in-screens']: navigationOnlyInScreens,
  },
};

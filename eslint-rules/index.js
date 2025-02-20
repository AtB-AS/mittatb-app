const translationsWarning = require('./translations-warning');
const importWarning = require('./import-warning');
const avoidImports = require('./avoid-imports');
const a11yLabelWhenAccessible = require('./a11y-label-when-accessible');

module.exports = {
  rules: {
    ['translations-warning']: translationsWarning,
    ['import-warning']: importWarning,
    ['avoid-imports']: avoidImports,
    ['a11y-label-when-accessible']: a11yLabelWhenAccessible,
  },
};

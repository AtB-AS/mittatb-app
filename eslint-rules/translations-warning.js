module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
  },
  create: function (context) {
    const config = {
      translateFunctionIdentifiers: ['t', 'tStatic'],
      translateModulePrefix: '@atb/translations',
    };

    const objectify = (names) =>
      names.reduce((obj, n) => ({...obj, [n]: true}), {});
    const NOT_TRANSLATION_SPECIFIERS = objectify([
      'Language',
      'DEFAULT_LANGUAGE',
      'lobot',
      'useTranslation',
      'appLanguages',
      'translation',
    ]);

    const identifiers = {};

    return {
      ImportDeclaration(node) {
        if (!node.source.value.startsWith(config.translateModulePrefix)) return;
        for (const s of node.specifiers) {
          const identifier = s.local.name;
          if (NOT_TRANSLATION_SPECIFIERS.hasOwnProperty(identifier)) continue;
          identifiers[identifier] = true;
        }
      },
      Identifier(node) {
        if (!identifiers.hasOwnProperty(node.name)) return;
        const validParent = parentCallExpressionWithIdentifiers(
          node.parent,
          config.translateFunctionIdentifiers,
        );
        if (node.parent.type !== 'MemberExpression' || validParent) {
          return;
        }
        const name = translationTextFullName(node.parent);

        context.report({
          node,
          message:
            'Expected {{ identifier }} to be argument of translate function {{ translateFunction }}',
          data: {
            identifier: name,
            translateFunction: config.translateFunctionIdentifiers.join(' or '),
          },
        });
      },
    };
  },
};

function parentCallExpressionWithIdentifiers(node, identifiers) {
  if (!node) return false;
  if (
    node.type === 'CallExpression' &&
    node.callee &&
    identifiers.includes(node.callee.name)
  ) {
    return node;
  }
  return parentCallExpressionWithIdentifiers(node.parent, identifiers);
}

function translationTextFullName(node) {
  const base = node.object.name;
  const prop = node.property.name;
  return `${base}.${prop}.${onlyProperties(node.parent)}`.slice(0, -1);
}
function onlyProperties(node) {
  if (node.type !== 'MemberExpression' || !node.property) return '';
  if (!node.property || !node.property.name) return '';
  return `${node.property.name}.${onlyProperties(node.parent)}`;
}

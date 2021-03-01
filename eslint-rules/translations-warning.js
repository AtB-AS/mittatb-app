module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
  },
  create: function (context) {
    const config = {
      translateFunctionIdentifier: 't',
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

    let identifiers = {};

    return {
      ImportDeclaration(node) {
        if (!node.source.value.startsWith(config.translateModulePrefix)) return;
        for (let s of node.specifiers) {
          const identifier = s.local.name;
          if (NOT_TRANSLATION_SPECIFIERS.hasOwnProperty(identifier)) continue;
          identifiers[identifier] = true;
        }
      },
      Identifier(node) {
        if (!identifiers.hasOwnProperty(node.name)) return;
        const validParent = parentCallExpressionWithIdentifier(
          node.parent,
          config.translateFunctionIdentifier,
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
            translateFunction: config.translateFunctionIdentifier,
          },
        });
      },
    };
  },
};

function parentCallExpressionWithIdentifier(node, identifier) {
  if (!node) return false;
  if (
    node.type === 'CallExpression' &&
    node.callee &&
    node.callee.name === identifier
  ) {
    return node;
  }
  return parentCallExpressionWithIdentifier(node.parent, identifier);
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

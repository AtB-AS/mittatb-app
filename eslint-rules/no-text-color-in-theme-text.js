const TEXT_COLOR_VALUES = ['primary', 'secondary', 'disabled'];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent passing TextColor string literals as the color prop of ThemeText. Use the `type` prop instead.',
    },
    messages: {
      noTextColor:
        'Do not pass TextColor string \'{{ value }}\' as the color prop of ThemeText. Use the `type` prop instead (e.g. type="{{ value }}"), or pass a ContrastColor object.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type !== 'JSXIdentifier' ||
          node.name.name !== 'ThemeText'
        )
          return;

        for (const attr of node.attributes) {
          if (
            attr.type !== 'JSXAttribute' ||
            attr.name.name !== 'color' ||
            !attr.value
          )
            continue;

          // color="secondary"
          if (
            attr.value.type === 'Literal' &&
            TEXT_COLOR_VALUES.includes(attr.value.value)
          ) {
            context.report({
              node: attr,
              messageId: 'noTextColor',
              data: {value: attr.value.value},
            });
          }

          // color={"secondary"}
          if (
            attr.value.type === 'JSXExpressionContainer' &&
            attr.value.expression.type === 'Literal' &&
            TEXT_COLOR_VALUES.includes(attr.value.expression.value)
          ) {
            context.report({
              node: attr,
              messageId: 'noTextColor',
              data: {value: attr.value.expression.value},
            });
          }
        }
      },
    };
  },
};

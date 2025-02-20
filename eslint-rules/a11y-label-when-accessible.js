// When a view is marked as accessible, it is a good practice to set an
// accessibilityLabel on the view, so that people who use VoiceOver or TalkBack
// know what element they have selected.
// https://reactnative.dev/docs/accessibility#accessibilitylabel

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        let hasAccessible = false;
        let hasAccessibilityLabel = false;

        node.attributes.forEach((attr) => {
          if (
            attr.type === 'JSXAttribute' &&
            attr.name.name === 'accessible' &&
            attr.value &&
            attr.value.type === 'JSXExpressionContainer' &&
            attr.value.expression.value === true
          ) {
            hasAccessible = true;
          }

          if (
            attr.type === 'JSXAttribute' &&
            attr.name.name === 'accessibilityLabel'
          ) {
            hasAccessibilityLabel = true;
          }
        });

        if (hasAccessible && !hasAccessibilityLabel) {
          context.report({
            node,
            message:
              'Elements with accessible={true} should have an accessibilityLabel.',
          });
        }
      },
    };
  },
};

/**
 * ESLint rule to prevent React hooks from being called inside StyleSheet.createThemeHook.
 *
 * The React Compiler memoizes createThemeHook calls, which breaks the Rules of Hooks
 * when hooks are called inside the theme function. This rule enforces that theme
 * functions passed to createThemeHook only use the theme parameter and don't call hooks.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent React hooks from being called inside StyleSheet.createThemeHook',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noHooksInCreateThemeHook:
        'React hooks cannot be called inside StyleSheet.createThemeHook. The React Compiler memoizes these calls, which breaks the Rules of Hooks. Use the theme parameter instead.',
    },
    schema: [],
  },
  create: function (context) {
    // Track when we're inside a createThemeHook call
    let insideCreateThemeHook = 0;

    return {
      CallExpression(node) {
        const callee = node.callee;

        // Check if this is a StyleSheet.createThemeHook call
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'StyleSheet' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'createThemeHook'
        ) {
          // We found a createThemeHook call, increment the depth counter
          insideCreateThemeHook++;
        }

        // Check if we're inside a createThemeHook and this is a hook call
        if (insideCreateThemeHook > 0) {
          // Check if this is a hook call (function starting with "use")
          if (
            callee.type === 'Identifier' &&
            callee.name.startsWith('use') &&
            callee.name.length > 3 &&
            callee.name[3] === callee.name[3].toUpperCase()
          ) {
            context.report({
              node: callee,
              messageId: 'noHooksInCreateThemeHook',
            });
          }
        }
      },

      // When we exit a CallExpression, decrement the depth if it was createThemeHook
      'CallExpression:exit'(node) {
        const callee = node.callee;

        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'StyleSheet' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'createThemeHook'
        ) {
          insideCreateThemeHook--;
        }
      },
    };
  },
};

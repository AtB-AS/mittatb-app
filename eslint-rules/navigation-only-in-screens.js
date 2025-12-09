/**
 * ESLint rule to ensure navigation library usage only happens in Screen or Stack files.
 * This helps maintain type-safety of react-navigation, especially for components
 * used in several different navigation trees.
 *
 * Navigation should only be used in files ending with "Screen" or "Stack", and any navigation
 * that needs to happen in nested components should be passed as callback functions.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Navigation library should only be used in files ending with "Screen" or "Stack"',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      navigationImportNotAllowed:
        'Navigation imports are only allowed in Screen or Stack files. File "{{ filename }}" does not end with "Screen" or "Stack". Pass navigation as callbacks to nested components instead.',
      navigationHookNotAllowed:
        'Navigation hooks (like useNavigation, useIsFocused, useRoute) are only allowed in Screen or Stack files. File "{{ filename }}" does not end with "Screen" or "Stack".',
      navigationMethodNotAllowed:
        'Navigation methods (like navigation.navigate, navigation.goBack) are only allowed in Screen or Stack files. File "{{ filename }}" does not end with "Screen" or "Stack". Pass navigation callbacks from Screen components instead.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedPaths: {
            type: 'array',
            items: {type: 'string'},
            description:
              'Array of glob patterns for paths where navigation is allowed even if not a Screen file',
          },
          allowedImports: {
            type: 'array',
            items: {type: 'string'},
            description:
              'Array of import names that are allowed even in non-Screen files (e.g., type-only imports)',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const filename = context.getFilename();
    const options = context.options[0] || {};
    const allowedPaths = options.allowedPaths || [];
    const allowedImports = options.allowedImports || [
      'NavigationProp',
      'NavigatorScreenParams',
      'StackScreenProps',
      'RouteProp',
      'DefaultTheme',
      'NavigationContainer',
      'PartialRoute',
      'Route',
      'NavigationState',
      'PartialState',
    ];

    // Check if file is a Screen or Stack file (case-insensitive)
    const isScreenOrStackFile = /(Screen|Stack)\.(tsx?|jsx?)$/i.test(filename);

    // Check if file is in an allowed path
    const isAllowedPath = allowedPaths.some((pattern) => {
      // Simple glob matching - can be enhanced if needed
      const regex = new RegExp(
        pattern.replace(/\*/g, '.*').replace(/\?/g, '.'),
      );
      return regex.test(filename);
    });

    // If it's a Screen/Stack file or allowed path, allow everything
    if (isScreenOrStackFile || isAllowedPath) {
      return {};
    }

    // Navigation hooks that should be restricted
    const navigationHooks = [
      'useNavigation',
      'useIsFocused',
      'useFocusEffect',
      'useRoute',
      'useNavigationContainerRef',
      'useBottomTabBarHeight',
    ];

    // Navigation packages to check
    const navigationPackages = [
      '@react-navigation/native',
      '@react-navigation/stack',
      '@react-navigation/bottom-tabs',
      '@react-navigation/material-top-tabs',
    ];

    // Track imported navigation hooks
    const importedNavigationHooks = new Set();
    const importedNavigationPackages = new Set();

    return {
      // Check imports from navigation packages
      ImportDeclaration(node) {
        const source = node.source.value;

        // Check if importing from a navigation package
        const isNavigationPackage = navigationPackages.some((pkg) =>
          source.startsWith(pkg),
        );

        if (isNavigationPackage) {
          importedNavigationPackages.add(source);

          // Check each imported specifier
          node.specifiers.forEach((specifier) => {
            const importName =
              specifier.imported?.name || specifier.local?.name;

            // Allow type-only imports and explicitly allowed imports
            const isTypeImport =
              specifier.type === 'ImportSpecifier' &&
              specifier.importKind === 'type';
            const isAllowedImport = allowedImports.includes(importName);

            if (!isTypeImport && !isAllowedImport) {
              // Check if it's a navigation hook
              if (navigationHooks.includes(importName)) {
                importedNavigationHooks.add(importName);
              }

              // Report error for non-type, non-allowed imports
              context.report({
                node: specifier,
                messageId: 'navigationImportNotAllowed',
                data: {
                  filename: filename.split('/').pop(),
                },
              });
            }
          });
        }
      },

      // Check for usage of navigation hooks
      CallExpression(node) {
        const callee = node.callee;

        // Check for direct hook calls like useNavigation()
        if (
          callee.type === 'Identifier' &&
          importedNavigationHooks.has(callee.name)
        ) {
          context.report({
            node: callee,
            messageId: 'navigationHookNotAllowed',
            data: {
              filename: filename.split('/').pop(),
            },
          });
        }
      },

      // Check for navigation method calls (navigation.navigate, navigation.goBack, etc.)
      MemberExpression(node) {
        const object = node.object;
        const property = node.property;

        // Check if accessing a property on something called "navigation"
        if (
          object.type === 'Identifier' &&
          object.name === 'navigation' &&
          property.type === 'Identifier'
        ) {
          const navigationMethods = [
            'navigate',
            'goBack',
            'dispatch',
            'canGoBack',
            'isFocused',
            'reset',
            'replace',
            'push',
            'pop',
            'popToTop',
            'setParams',
            'setOptions',
          ];

          if (navigationMethods.includes(property.name)) {
            // Check if this navigation object comes from useNavigation
            // by checking the scope chain
            let currentScope = context.getScope();
            let foundNavigation = false;
            let isFromProps = false;

            // Walk up the scope chain to find where navigation is defined
            while (currentScope) {
              const variable = currentScope.variables.find(
                (v) => v.name === 'navigation',
              );

              if (variable) {
                // Check if navigation is defined via useNavigation
                const defs = variable.defs || [];
                const isFromUseNavigation = defs.some((def) => {
                  if (
                    def.type === 'Variable' &&
                    def.node &&
                    def.node.type === 'VariableDeclarator'
                  ) {
                    const init = def.node.init;
                    return (
                      init &&
                      init.type === 'CallExpression' &&
                      init.callee &&
                      (init.callee.name === 'useNavigation' ||
                        (init.callee.type === 'Identifier' &&
                          importedNavigationHooks.has(init.callee.name)))
                    );
                  }
                  // Check if navigation comes from props
                  if (def.type === 'Parameter') {
                    isFromProps = true;
                    return false; // Don't treat props as useNavigation
                  }
                  return false;
                });

                if (isFromUseNavigation) {
                  foundNavigation = true;
                  break;
                }
              }

              currentScope = currentScope.upper;
            }

            // Report error if navigation comes from useNavigation OR from props
            // (props should be callbacks, not navigation objects)
            if (foundNavigation || isFromProps) {
              context.report({
                node: property,
                messageId: 'navigationMethodNotAllowed',
                data: {
                  filename: filename.split('/').pop(),
                },
              });
            }
          }
        }
      },
    };
  },
};


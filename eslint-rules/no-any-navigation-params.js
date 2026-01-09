/**
 * ESLint rule to prevent navigation methods from being called with 'any' typed parameters.
 * This helps maintain type-safety for react-navigation by catching cases where screen names
 * or params are typed as 'any', even when not using explicit 'as any' casts.
 *
 * The rule checks navigation method calls like navigate(), replace(), push(), dispatch(), etc.
 * and reports an error if any argument has the 'any' type.
 */

const {ESLintUtils} = require('@typescript-eslint/utils');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent navigation methods from being called with any-typed parameters',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      anyNavigationParam:
        'Navigation method "{{ method }}" is called with an argument of type "any" at position {{ position }}. Please use explicit types for navigation parameters to maintain type-safety.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          navigationMethods: {
            type: 'array',
            items: {type: 'string'},
            description:
              'Array of navigation method names to check (default: navigate, replace, push, pop, popTo, dispatch, etc.)',
          },
          allowedPaths: {
            type: 'array',
            items: {type: 'string'},
            description:
              'Array of glob patterns for paths where any-typed navigation parameters are allowed',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const filename = context.getFilename();
    const options = context.options[0] || {};
    const navigationMethods = options.navigationMethods || [
      'navigate',
      'replace',
      'push',
      'pop',
      'popTo',
      'popToTop',
      'dispatch',
      'reset',
      'setParams',
    ];
    const allowedPaths = options.allowedPaths || [];

    // Check if file is in an allowed path
    const isAllowedPath = allowedPaths.some((pattern) => {
      // Simple glob matching - can be enhanced if needed
      const regex = new RegExp(
        pattern.replace(/\*/g, '.*').replace(/\?/g, '.'),
      );
      return regex.test(filename);
    });

    // If it's an allowed path, skip all checks
    if (isAllowedPath) {
      return {};
    }

    // Get the TypeScript parser services
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    /**
     * Check if a TypeScript type is directly 'any' (not a complex type that includes any)
     */
    function isDirectlyAnyType(type) {
      // Only return true if the type is exactly 'any', not if it's a union/intersection
      // that happens to include 'any' somewhere
      if (type.flags & 1 /* TypeFlags.Any */) {
        // Make sure it's not part of a more complex type
        return true;
      }

      return false;
    }

    /**
     * Check if an object literal has properties that are directly typed as 'any'
     * This is for checking inline object arguments like {name: something, params: something}
     */
    function hasDirectAnyProperties(type) {
      // Only check if this is an anonymous object type (not a named interface/type)
      // This prevents false positives from navigation library types
      if (!type.getProperties || type.aliasSymbol) {
        return false;
      }

      const properties = type.getProperties();

      // Only check a limited depth to avoid false positives from library types
      for (const prop of properties) {
        const propType = checker.getTypeOfSymbolAtLocation(
          prop,
          prop.valueDeclaration || prop.declarations?.[0],
        );

        if (isDirectlyAnyType(propType)) {
          return true;
        }
      }

      return false;
    }

    return {
      CallExpression(node) {
        let methodName = null;
        let shouldCheck = false;

        // Check if this is a navigation method call (navigation.navigate, etc.)
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'navigation' &&
          node.callee.property.type === 'Identifier' &&
          navigationMethods.includes(node.callee.property.name)
        ) {
          methodName = node.callee.property.name;
          shouldCheck = true;
        }

        // Check if this is a StackActions method call (StackActions.replace, etc.)
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'StackActions' &&
          node.callee.property.type === 'Identifier'
        ) {
          methodName = `StackActions.${node.callee.property.name}`;
          shouldCheck = true;
        }

        if (shouldCheck && methodName) {
          // Check each argument
          node.arguments.forEach((arg, index) => {
            // Get the TypeScript node for this argument
            const tsNode = parserServices.esTreeNodeToTSNodeMap.get(arg);

            if (!tsNode) {
              return;
            }

            // Get the type of the argument
            const argType = checker.getTypeAtLocation(tsNode);

            // Check if the argument type is directly 'any' or has properties that are 'any'
            if (isDirectlyAnyType(argType) || hasDirectAnyProperties(argType)) {
              context.report({
                node: arg,
                messageId: 'anyNavigationParam',
                data: {
                  method: methodName,
                  position: index + 1,
                },
              });
            }
          });
        }
      },
    };
  },
};

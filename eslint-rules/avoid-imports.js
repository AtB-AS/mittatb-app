module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',

    messages: {
      avoidableModuleWithAlternative:
        'Package {{ actualModule }} should be avoided. Use {{ suggestedModule }} instead.',
      avoidableModule: 'Package {{ actualModule }} should be avoided.',
    },

    schema: [
      {
        anyOf: [
          {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          {
            type: 'array',
            items: {
              anyOf: [
                {type: 'string'},
                {
                  type: 'object',
                  additionalProperties: {
                    type: 'string',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  create: function (context) {
    const [config] = context.options;
    const avoidables = avoidableModules(config);

    return {
      ImportDeclaration(node) {
        const fullModule = node.source.value;
        const actualModule = avoidables.find((m) => fullModule.startsWith(m));
        if (!actualModule) {
          return;
        }

        const suggestedModule = findSuggestedModule(config, actualModule);
        const data = {
          actualModule,
          suggestedModule,
        };
        context.report({
          node,
          messageId: suggestedModule
            ? 'avoidableModuleWithAlternative'
            : 'avoidableModule',
          data,
          fix: suggestedModule
            ? function (fixer) {
                const replaced = node.source.raw.replace(
                  actualModule,
                  suggestedModule,
                );
                return fixer.replaceText(node.source, replaced);
              }
            : undefined,
        });
      },
    };
  },
};

function avoidableModules(mappings) {
  if (Array.isArray(mappings)) {
    return mappings.flatMap(stringOrKeys);
  }
  return stringOrKeys(mappings);
}
function stringOrKeys(item) {
  if (typeof item === 'string') {
    return item;
  }
  return Object.keys(item);
}

function findSuggestedModule(mappings, name) {
  if (!Array.isArray(mappings)) {
    return mappings[name];
  }
  for (let item of mappings) {
    if (typeof item === 'string') continue;
    if (item[name]) return item[name];
  }
}

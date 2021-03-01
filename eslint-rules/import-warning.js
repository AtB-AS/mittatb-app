module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',

    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'string',
        },
      },
    ],
  },
  create: function (context) {
    const [mappings] = context.options;

    return {
      ImportDeclaration(node) {
        const actualModule = node.source.value;
        for (let specifierNode of node.specifiers) {
          const identifier = specifierNode.local.name;
          const preferredModule = mappings[identifier];
          if (!preferredModule) continue;

          if (preferredModule !== actualModule) {
            context.report({
              node: specifierNode,
              message:
                '{{ identifier }} should be importet from {{ preferredModule }} not {{ actualModule }}',
              data: {
                identifier,
                preferredModule,
                actualModule,
              },
            });
          }
        }
      },
    };
  },
};

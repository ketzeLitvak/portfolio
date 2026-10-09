// Prettier preserves blank lines but does not insert them between imports or functions.
const unwrap = (statement) => statement.declaration ?? statement;

const declaresFunction = (statement) => {
  const node = unwrap(statement);

  return (
    node.type === 'FunctionDeclaration' ||
    (node.type === 'VariableDeclaration' &&
      node.declarations.some((declaration) =>
        ['ArrowFunctionExpression', 'FunctionExpression'].includes(declaration.init?.type),
      ))
  );
};

export default {
  meta: {
    type: 'layout',
    docs: { description: 'Separate imports and function definitions with a blank line.' },
    fixable: 'whitespace',
    schema: [],
    messages: { spacing: 'Leave a blank line between imports and around function definitions.' },
  },

  create(context) {
    const source = context.sourceCode;

    const check = (node) => {
      for (let index = 1; index < node.body.length; index++) {
        const previous = node.body[index - 1];
        const current = node.body[index];
        const requiresSpace =
          previous.type === 'ImportDeclaration' ||
          current.type === 'ImportDeclaration' ||
          declaresFunction(previous) ||
          declaresFunction(current);

        if (!requiresSpace) continue;

        const comments = source.getCommentsBefore(current);
        const start = comments.find((comment) => comment.range[0] >= previous.range[1]) ?? current;

        if (start.loc.start.line > previous.loc.end.line + 1) continue;

        context.report({
          node: current,
          messageId: 'spacing',
          fix: (fixer) => fixer.insertTextAfter(previous, '\n'),
        });
      }
    };

    return { Program: check, BlockStatement: check };
  },
};

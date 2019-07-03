const {
  compiler,
  tokenizer,
  parser,
  transformer,
  codeGenerator,
} = require('./index')

const input = '(add 2 (subtract 4 2))'

const tokens = [
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        },
]

const ast = {
  type: 'Program',
  body: [
    {
      type: 'CallExpression',
      name: 'add',
      params: [
        {
          type: 'NumberLiteral',
          value: '2'
        },
        {
          type: 'CallExpression',
          name: 'subtract',
          params: [
            {
              type: 'NumberLiteral',
              value: '4',
            },
            {
              type: 'NumberLiteral',
              value: '2',
            },
          ],
        },
      ],
    },
  ],
};

const newAst = {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'add',
        },
        arguments: [
          {
            type: 'NumberLiteral',
            value: '2',
          },
          {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'subtract',
            },
            arguments: [
              {
                type: 'NumberLiteral',
                value: '4',
              },
              {
                type: 'NumberLiteral',
                value: '2',
              },
            ],
          },
        ],
      },
    },
  ],
};

const output = 'add(2, subtract(4, 2));'

test('Tokenizer should turn `input` string into `tokens` array', () => {
  expect(tokenizer(input)).toEqual(tokens)
})

test('Parser should turn `tokens` array into `ast`', () => {
  expect(parser(tokens)).toEqual(ast)
})

test('Transformer should turn `ast` into a `newAst`', () => {
  expect(transformer(ast)).toEqual(newAst)
})

test('Code Generator should turn `newAst` into `output` string', () => {
  expect(codeGenerator(newAst)).toEqual(output)
})

test('Compiler should turn `input` into `output`', () => {
  expect(compiler(input)).toEqual(output)
})

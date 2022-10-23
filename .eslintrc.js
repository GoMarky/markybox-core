/* eslint-env node */

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  root: true,
  plugins: ['import', 'vue', 'simple-import-sort'],
  extends: ['plugin:vue/vue3-essential', '@vue/eslint-config-typescript/recommended', 'prettier', 'prettier/vue'],
  rules: {
    // @NOTE: Disabled because it breaks when importing types.
    //        But typescript does this better anyway, so it does not matter.
    'import/named': ['off'],

    // @NOTE: We can rely on hoisting
    'no-use-before-define': ['error', { functions: false, classes: false }],

    // @NOTE: some of logs are okay
    'no-console': isDevelopment ? 'off' : ['warn', { allow: ['info', 'warn', 'error'] }],

    // @NOTE: eslint fucks up with similar namespace and interface declarations
    'no-redeclare': 'off',
    'no-unused-vars': 'off', // @typescript-eslint/no-unused-vars
    'no-useless-concat': 'error',

    'no-multiple-empty-lines': 'error',
    'comma-dangle': ['error', 'always-multiline'],

    camelcase: 'off',

    quotes: ['error', 'single', { avoidEscape: true }],
    'eol-last': ['error', 'always'],

    // Отключил пока для того чтобы было более читабельнее конкатенировать длинные выражения
    'prefer-template': 'off',

    'object-curly-spacing': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'space-before-function-paren': ['off'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
      },
    ],
    'no-extra-parens': 'off',

    semi: 'off',

    // @NOTE: TS
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/semi': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', argsIgnorePattern: '^_' }],
    '@typescript-eslint/indent': ['error', 2],

    // @NOTE: Vue
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],

    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 1,
        ignores: [],
      },
    ],

    'vue/no-export-in-script-setup': 'off',

    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'v-slot',
        default: 'v-slot',
        named: 'shorthand',
      },
    ],

    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'always',
        },
        svg: 'any',
        math: 'any',
      },
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        selfClosingTag: 'always',
      },
    ],

    // @NOTE: simple-import-sort requires to turn off other import-related sorting rules
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-restricted-imports': [
      'error',
      {
        name: 'lodash',
        message: "Please use '@lodash'",
      },
      {
        name: 'dayjs',
        message: "Please use '@dayjs'",
      },
    ],
  },

  overrides: [
    {
      files: ['*.vue', '*.ts'],
      rules: {
        '@typescript-eslint/indent': 'off',
      },
    },
    {
      files: ['Icon*.vue'],
      rules: {
        'max-len': 'off',
      },
    },

    // TODO: Fix file name and remove this rule.
    {
      files: ['Root.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },

  ],
};

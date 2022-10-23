module.exports = {
  extends: [
    'stylelint-config-recommended-vue/scss',
  ],
  customSyntax: 'postcss-html',
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'string-no-newline': null,
    'no-descending-specificity': null,
    'scss/at-import-partial-extension': null,
    'no-empty-source': null,
  },
};

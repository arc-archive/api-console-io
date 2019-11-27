module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
  },
};

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  globals: {
    // CodeceptJS globals
    Feature: 'readonly',
    Scenario: 'readonly',
    Before: 'readonly',
    After: 'readonly',
    BeforeSuite: 'readonly',
    AfterSuite: 'readonly',
    within: 'readonly',
    actor: 'readonly',
    inject: 'readonly',
    codeceptjs: 'readonly',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-undef': 'off', // TypeScript handles this
    'no-unused-vars': 'off', // TypeScript handles this
  },
};

const importSortGroupings = {
  groups: [
    // Packages. `react` related packages come first.
    // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
    ['^react', '^@?\\w', '^@?\\w.*\\u0000$'],
    // Absolute imports
    ['^(src|@)/', '^(src|@)/.*\\u0000$'],
    // relative imports
    ["^\\.", "^\\..*\\u0000$"],
  ],
}

module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    'react',
    '@typescript-eslint',
    'simple-import-sort'
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
    'simple-import-sort/imports': ['error', importSortGroupings],
    'simple-import-sort/exports': 'error',
    'react/prop-types': 'off',
  }
}

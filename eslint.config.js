// eslint.config.js
export default [
  {
      rules: {
          "no-unused-vars": "error",
          "no-undef": "error"
      },
      ignorePatterns: [
        'dist/*', 
        'lib/*',
        'node_modules/*', ]
      
  }
];
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  modulePathIgnorePatterns: ['__tests__/data', '__tests__/utils'],
  silent: true
};
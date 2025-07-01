// jest.config.js
export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Fix ESM imports with .js extension
  },
  setupFiles: ['<rootDir>/jest.setup.js'], // Add this line
};

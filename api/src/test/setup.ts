import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Set test environment
process.env['NODE_ENV'] = 'test';

// Set test database URI
process.env['MONGODB_URI'] = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/snippet_summarizer_test';

// Global test timeout - increased for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Ensure we're using mock AI client in tests
console.log('Test environment: Using MockAiCompletionClient');

// Setup and teardown for database
beforeAll(async () => {
  try {
    await mongoose.connect(process.env['MONGODB_URI']!);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from test database');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
});

// Clean up database between tests
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (collection) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
}); 
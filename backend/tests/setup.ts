import 'reflect-metadata';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-for-testing';
  process.env.JWT_EXPIRES_IN = '1h';
});

afterAll(async () => {
  
});


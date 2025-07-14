import request from 'supertest';
import { app } from '../../index';
import { CreateSnippetRequest } from '../../types/snippet';

describe('POST /snippets', () => {
  const validSnippetData: CreateSnippetRequest = {
    text: 'This is a test snippet that should be summarized by the AI service. It contains enough content to generate a meaningful summary.'
  };

  describe('Success cases', () => {
    it('should create a snippet with AI-generated summary', async () => {
      const response = await request(app)
        .post('/snippets')
        .send(validSnippetData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        text: validSnippetData.text,
        summary: expect.any(String),
        createdAt: expect.any(String)
      });

      // Verify summary is reasonable length (≤30 words as per requirements)
      const summaryWords = response.body.summary.split(' ').length;
      expect(summaryWords).toBeLessThanOrEqual(30);
      expect(summaryWords).toBeGreaterThan(0);
    });

    it('should return proper headers', async () => {
      const response = await request(app)
        .post('/snippets')
        .send(validSnippetData)
        .expect(201);

      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.headers['location']).toMatch(/\/snippets\/[a-f0-9]{24}$/);
    });
  });

  describe('Validation errors', () => {
    it('should reject empty text', async () => {
      const response = await request(app)
        .post('/snippets')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Validation Error',
        message: expect.stringContaining('Text cannot be empty'),
        statusCode: 400
      });
    });

    it('should reject missing text field', async () => {
      const response = await request(app)
        .post('/snippets')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Validation Error',
        message: expect.stringContaining('Required'),
        statusCode: 400
      });
    });

    it('should reject text that is too long', async () => {
      const longText = 'a'.repeat(10001);
      const response = await request(app)
        .post('/snippets')
        .send({ text: longText })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Validation Error',
        message: expect.stringContaining('Text cannot exceed 10,000 characters'),
        statusCode: 400
      });
    });

    it('should reject invalid JSON', async () => {
      const response = await request(app)
        .post('/snippets')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: expect.stringContaining('Invalid JSON'),
        statusCode: 400
      });
    });

    it('should trim whitespace from text', async () => {
      const response = await request(app)
        .post('/snippets')
        .send({ text: '  trimmed text  ' })
        .expect(201);

      expect(response.body.text).toBe('trimmed text');
    });
  });

  describe('Error handling', () => {
    it('should handle AI service errors gracefully', async () => {
      // This test will be implemented when we add AI service mocking
      // For now, we'll test the structure
      const response = await request(app)
        .post('/snippets')
        .send(validSnippetData)
        .expect(201);

      expect(response.body).toHaveProperty('summary');
    });

    it('should handle database errors gracefully', async () => {
      // This test will be implemented when we add database mocking
      // For now, we'll test the structure
      const response = await request(app)
        .post('/snippets')
        .send(validSnippetData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });
  });
});

describe('GET /snippets/:id', () => {
  let createdSnippetId: string;

  beforeAll(async () => {
    // Create a snippet for testing retrieval
    const response = await request(app)
      .post('/snippets')
      .send({ text: 'Test snippet for retrieval' });
    
    createdSnippetId = response.body.id;
  });

  describe('Success cases', () => {
    it('should retrieve a snippet by ID', async () => {
      const response = await request(app)
        .get(`/snippets/${createdSnippetId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdSnippetId,
        text: 'Test snippet for retrieval',
        summary: expect.any(String),
        createdAt: expect.any(String)
      });
    });
  });

  describe('Error cases', () => {
    it('should return 404 for non-existent snippet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/snippets/${fakeId}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Not Found',
        message: 'Snippet not found',
        statusCode: 404
      });
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/snippets/invalid-id')
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Validation Error',
        message: expect.stringContaining('Invalid snippet ID format'),
        statusCode: 400
      });
    });
  });
});

describe('GET /snippets', () => {
  describe('Success cases', () => {
    it('should return list of all snippets', async () => {
      const response = await request(app)
        .get('/snippets')
        .expect(200);

      expect(response.body).toMatchObject({
        snippets: expect.any(Array),
        total: expect.any(Number)
      });

      if (response.body.snippets.length > 0) {
        expect(response.body.snippets[0]).toMatchObject({
          id: expect.any(String),
          text: expect.any(String),
          summary: expect.any(String),
          createdAt: expect.any(String)
        });
      }
    });

    it('should return empty array when no snippets exist', async () => {
      // This test assumes we can clear the database or it's empty
      const response = await request(app)
        .get('/snippets')
        .expect(200);

      expect(response.body).toMatchObject({
        snippets: [],
        total: 0
      });
    });
  });
}); 
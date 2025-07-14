import request from 'supertest';
import { app } from '../../index';

describe('Health Check', () => {
  it('should return 200 OK for health endpoint', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toEqual({
      status: 'OK',
      timestamp: expect.any(String)
    });
  });
}); 
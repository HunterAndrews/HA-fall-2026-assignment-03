import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  it('should pass placeholder test', () => {
    expect(true).toBe(true);
  });
    // TODO: Student implementation - Part 1: Integration Testing
    // Test user creation (POST /users)
    it ('should create a user', async () => { // test for user creation/successful user creation
      const response = await request(app)
        .post('/users')
        .send({ name: 'John Doe', email: 'johndoe@example.com' });

      expect(response.status).toBe(201);  // 201 is status code for created
      expect(response.body).toHaveProperty('id');
    });

    // Test ticket creation (POST /tickets)
    it('should create a ticket', async () => {  // test for ticket creation
      const userResponse = await request(app) // test ticket needs user
        .post('/users')
        .send({ name: 'Ticket Creator', email: 'creator@example.com' });

      const response = await request(app) // send request to server
        .post('/tickets')
        .set('X-User-Id', String(userResponse.body.id))
        .send({ title: 'Test Ticket', description: 'A ticket for testing' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Ticket');
      expect(response.body.description).toBe('A ticket for testing');
    });

    // Test auth middleware rejection (401 when X-User-Id is missing or invalid)
    it('should reject unauthorized ticket creation', async () => {  // test for auth middleware rejection
      const response = await request(app)
        .post('/tickets')
        .send({ title: 'Unauthorized Ticket',description: 'This should not be created', });

      expect(response.status).toBe(401);
    });

    it('should reject an invalid X-User-Id', async () => {  // test invalid user id
      const response = await request(app)
        .post('/tickets')
        .set('X-User-Id', 'abc')
        .send({ title: 'Invalid User Ticket', description: 'This should not be created', });

      expect(response.status).toBe(401);
    });

    // Test auth middleware authorization (200 when X-User-Id is valid)
    it('should authorize a valid X-User-Id', async () => {  // test valid user id
      const userResponse = await request(app)
        .post('/users')
        .send({ name: 'Valid User', email: 'valid-user@example.com' });

      expect(userResponse.status).toBe(201);

      const response = await request(app) // send request to server
        .post('/tickets')
        .set('X-User-Id', String(userResponse.body.id))
        .send({ title: 'Valid User Ticket', description: 'This should be created', });

      expect(response.status).toBe(201);
    });
    
    // Test 404 responses for non-existent users and tickets
    it ('should return 404 for non-existent users', async () => { // test for 404 responses for non-existent users
      const response = await request(app)
      .get('/users/999999');  // get user with id 999999

      expect(response.status).toBe(404);  // 404 is status code for not found
      expect(response.text).toEqual('User not found');
    });
    
    // Test pagination and filtering on GET /tickets
    it('should support pagination on GET /tickets', async () => { // test for tickets pagination
      const response = await request(app)
        .get('/tickets?limit=10&offset=0'); // get first 10 tickets

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should filter tickets by status', async () => { // test for tickets filtered by status
      const response = await request(app)
        .get('/tickets?status=open'); // get tickets with status open

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);  // Array of tickets to be returned

      for (const ticket of response.body) {
        expect(ticket.status).toBe('open');
      }
      // expect(true).toBe(true);
    });
});

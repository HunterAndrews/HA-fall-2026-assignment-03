import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';
import { getTotalHoursForTicket, insertTimeLog } from '../src/dal/timeLogs.js';

describe('Part 2: Time Logs Tests', () => {
  it('inserts time logs and totals hours for a ticket', async () => { // test for time logs
    const userResponse = await request(app) // test time logging
      .post('/users')
      .send({ name: 'Time Logger', email: 'time-logger@example.com' });

    const ticketResponse = await request(app) // send request to server
      .post('/tickets')
      .set('X-User-Id', String(userResponse.body.id))
      .send({ title: 'Time Log Ticket', description: 'Test time logging' });

    const ticketId = ticketResponse.body.id as number;  // get ticket id
    const userId = userResponse.body.id as number;  // get user id
    const inserted = await insertTimeLog(ticketId, userId, 2);  // insert time log
    await insertTimeLog(ticketId, userId, 3);

    expect(inserted.ticket_id).toBe(ticketId);
    expect(inserted.user_id).toBe(userId);
    expect(inserted.logged_at).toBeInstanceOf(Date);
    await expect(getTotalHoursForTicket(ticketId)).resolves.toBe(5);
  });
});

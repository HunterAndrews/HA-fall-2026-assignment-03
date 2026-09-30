// TODO: Student implementation - Part 2: DAL for time logs
import { db, TimeLog } from '../db/database.js';
import { insertTimeLog } from './timeLogs.js';
import { getTotalHoursForTicket } from './tickets.js';

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<TimeLog> {
  // TODO: Student implementation
  return await db // insert time log into time_logs table
    .insertInto('time_logs')
    .values({
      ticket_id: ticketId,
      user_id: userId,
      hours,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  // TODO: Student implementation
  const result = await db // get total hours for ticket
    .selectFrom('time_logs')
    .select((eb) => eb.fn.sum<number>('hours').as('total_hours'))
    .where('ticket_id', '=', ticketId)
    .executeTakeFirst();

  return Number(result?.total_hours || 0);

  // return 0;
}
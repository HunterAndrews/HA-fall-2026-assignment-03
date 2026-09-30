import { Router } from 'express';
import { getAllTickets, getTicketById, createTicket, updateTicketStatus } from '../dal/tickets.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit   // get limit from query, ?limit = 10
      ? Number(req.query.limit)
      : undefined;

    const offset = req.query.offset // get offset from query, ?offset = 10
      ? Number(req.query.offset)
      : undefined;

    const status = req.query.status // get status from query, ?status = open
      ? String(req.query.status)
      : undefined;

    const tickets = await getAllTickets({   // get all tickets from database
      limit,
      offset,
      status,
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tickets' });
  }
});

// GET /tickets/:id
router.get('/:id', async (req, res) => {
  try {
    const ticketId = Number(req.params.id); // get ticket id from url

    if (!Number.isInteger(ticketId)) {  // if ticket id is not an integer, send bad request
      res.status(404).send('Ticket not found');
      return;
    }

    const ticket = await getTicketById(ticketId);

    if (!ticket) {
      res.status(404).send('Ticket not found');
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ticket' });
  }
});

// POST /tickets
router.post('/', authMiddleware, async (req, res) => {
  try { // try to create ticket from request body, catch any errors
    const { title, description } = req.body;
    const creator_id = res.locals.userId;

    const ticket = await createTicket({ // create ticket in database
      creator_id,
      title,
      description,
    });

    res.status(201).json(ticket);
  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware,async (req, res) => {   // update ticket status
  try {
    const ticketId = Number(req.params.id);
    const { status } = req.body;

    const ticket = await updateTicketStatus(ticketId, status);

    if (!ticket) {
      res.status(404).send('Ticket not found');
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
router.post('/:id/time', (req, res) => {    // add time to ticket and send to client
  try {
    const ticketId = Number(req.params.id);
    const userId = res.locals.userId;
    const {hours} = req.body;
    // const time = req.body.time;

    res.status(201).json({  // send to client
      ticket_id: ticketId,
      user_id: userId,
      hours,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to log time',
    });
  }
});

// GET /tickets/:id/time
// router.get('/:id/time', (req, res) => { // get time for ticket and send to client
//   const ticketId = req.params.id;
//   const time = req.body;

//   if (!time) {
//     res.status(404).send('Time not found');
//     return;
//   }

//   res.send(time);
// });
router.get('/:id/time', async (req, res) => {
  try {
    const ticketId = Number(req.params.id);

    const totalHours = await getTotalHoursForTicket(ticketId);

    res.status(200).json({
      ticket_id: ticketId,
      total_hours: totalHours,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve time',
    });
  }
});

export default router;

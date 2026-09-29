import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';

const router = Router();

// TODO: Student implementation - Part 1: User Routes
// GET /users
router.get('/', async (req, res) => { // get all users and send to client
    try {   // try to get all users from database, catch any errors
        const users = await getAllUsers();  // get all users from database
        res.status(200).json(users);        // send to client, 220 is status code for ok
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);   // get user id from url

    if (!Number.isInteger(userId)) {        // if user id is not an integer, send bad request
      res.status(404).send('User not found');   // 404 is status code for not found
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' }); // 500 is status code for internal server error
  }
});

// POST /users
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await createUser({
      name,
      email,
    });

    res.status(201).json(user);  // 201 is status code for created
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;

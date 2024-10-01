import express from 'express';
import { config } from './config.js';
import Database from './database.js';

const router = express.Router();
router.use(express.json());

// Development only - don't do in production
console.log(config);

// Create database object
const database = new Database(config);

//maybe should not have used the term delegate - reserved?

router.get('/', async (_, res) => {
  try {
    // Return a list of attendees
    const delegates = await database.readAll();
    console.log(`delegates: ${JSON.stringify(delegates)}`);
    res.status(200).json(delegates);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create an attendee
    const delegate = req.body;
    console.log(`delegate: ${JSON.stringify(delegate)}`);
    const rowsAffected = await database.create(delegate);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get the attendee with the specified ID
    const delegateId = req.params.id;
    console.log(`delegateId: ${delegateId}`);
    if (delegateId) {
      const result = await database.read(delegateId);
      console.log(`delegates: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update the attendee with the specified ID
    const delegateId = req.params.id;
    console.log(`delegateId: ${delegateId}`);
    const delegate = req.body;

    if (delegateId && delegate) {
      delete delegate.id;
      console.log(`delegate: ${JSON.stringify(delegate)}`);
      const rowsAffected = await database.update(delegateId, delegate);
      res.status(200).json({ rowsAffected });
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete the attendee with the specified ID
    const delegateId = req.params.id;
    console.log(`delegateId: ${delegateId}`);

    if (!delegateId) {
      res.status(404);
    } else {
      const rowsAffected = await database.delete(delegateId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

export default router;
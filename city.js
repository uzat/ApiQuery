import express from 'express';
import { config } from './config.js';
import Database from './database.js';

const router = express.Router();
router.use(express.json());

// Development only - don't do in production
console.log(config);

// Create database object
const database = new Database(config);

router.get('/', async (_, res) => {
  try {
    // Return a list of cities
    const cities = await database.readAll();
    console.log(`cities: ${JSON.stringify(cities)}`);
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // add a city
    const city = req.body;
    console.log(`city: ${JSON.stringify(city)}`);
    const rowsAffected = await database.create(city);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get the city with the specified ID
    const cityId = req.params.id;
    console.log(`cityId: ${cityId}`);
    if (cityId) {
      const result = await database.read(cityId);
      console.log(`cities: ${JSON.stringify(result)}`);
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
    // Update the city with the specified ID
    const cityId = req.params.id;
    console.log(`cityId: ${cityId}`);
    const city = req.body;

    if (cityId && city) {
      delete city.id;
      console.log(`city: ${JSON.stringify(city)}`);
      const rowsAffected = await database.update(cityId, city);
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
    // Delete the city with the specified ID
    const cityId = req.params.id;
    console.log(`cityId: ${cityId}`);

    if (!cityId) {
      res.status(404);
    } else {
      const rowsAffected = await database.delete(cityId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

export default router;
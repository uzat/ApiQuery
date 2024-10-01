import express from 'express';
import { config } from './config.js';
import Database from './database.js';

// Import App routes
import delegate from './delegate.js';
import city from './city.js';
import openapi from './openapi.js';

const port = process.env.PORT || 3000;

const app = express();

// Connect App routes
app.use('/api-docs', openapi);
app.use('/delegates', delegate);
app.use('/cities', city);

app.use('*', (_, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
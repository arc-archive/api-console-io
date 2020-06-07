import express from 'express';
import parserRoute from './ParserRoute.js';
import { logger } from '../../lib/logging.js';

const router = express.Router();
export default router;

// API Parser route
router.use('/parser', parserRoute);

// Errors
router.use((req, res) => {
  const message = `Route ${req.url} not found`;
  logger.warn(message);
  res.status(404).send({
    error: true,
    message,
  });
});

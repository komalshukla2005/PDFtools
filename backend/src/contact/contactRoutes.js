import express from 'express';
import { submitContactForm } from './contactController.js';

const router = express.Router();

router.post('/submit', submitContactForm);

export default router;

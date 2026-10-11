import express from 'express';
import { getLevels, getLevel, createLevel, updateLevel, deleteLevel } from '../controllers/levelController.js';
const router = express.Router();

// Get all levels
router.get('/', getLevels);

// Get single level
router.get('/:id', getLevel);

// Create a new level
router.post('/', createLevel);

// Update a level
router.put('/:id', updateLevel);

// Delete a level
router.delete('/:id', deleteLevel);

export default router;
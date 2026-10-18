import express from 'express';
import { getIndividualLevels, getIndividualLevel, createIndividualLevel, updateIndividualLevel, deleteIndividualLevel} from '../controllers/individualLevelController.js';
const router = express.Router();

// Get all individual levels
router.get('/', getIndividualLevels);

// Get single individual level
router.get('/:id', getIndividualLevel);

// Create a new individual level
router.post('/', createIndividualLevel);

// Update a individual level
router.put('/:id', updateIndividualLevel);

// Delete a individual level
router.delete('/:id', deleteIndividualLevel);

export default router;
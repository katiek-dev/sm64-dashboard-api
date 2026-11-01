import express from 'express';
import {getSections, getSection, createSection, updateSection, deleteSection} from '../controllers/sectionController.js';
const router = express.Router();

// Get all sections
router.get('/', getSections)

// Get single section
 router.get('/:id', getSection)

// Create a new section
router.post('/', createSection)

// Update a section
router.put('/:id', updateSection);

// Delete a section
router.delete('/:id', deleteSection)

export default router;
import express from 'express';
import { PersonController } from '../controller/Person.controller.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

// Create a new person
router.post('/', upload.single('userImage'), async (req, res) => {
  try {
    const filePath = req.file ? `/User_Profile/${req.file.filename}` : null;

    const controller = new PersonController({
      ...req.body,
      userImage: filePath, // will be null if not uploaded
    });

    const response = await controller.createPerson();
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Get all persons
router.get('/', async (_req, res) => {
  try {
    const controller = new PersonController();
    const response = await controller.getAllPerson();
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Get person by employeeCode or workEmail
router.get('/:Code', async (req, res) => {
  const input = req.params.Code;
  const controller = new PersonController();

  try {
    // Check if input is a numeric string (e.g., "1234")
    const isNumericString = /^\d+$/.test(input); // true for "1234", false for "abc123"

    let response;

    if (isNumericString) {
      // Treat as employeeCode
      response = await controller.getByEmployeeCode(input);
    } else {
      // Treat as workEmail
      response = await controller.getByWorkEmail(input);
    }

    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err.errors || null,
    });
  }
});


// Update person by employeeCode
router.put('/:employeeCode',upload.single('userImage'), async (req, res) => {
  try {
    const imagePath = req.file ? `/User_Profile/${req.file.filename}` : null;

    const controller = new PersonController({
      ...req.body,
      userImage: imagePath
    });

    const response = await controller.updatePerson(req.params.employeeCode);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Delete person by employeeCode
router.delete('/:employeeCode', async (req, res) => {
  try {
    const controller = new PersonController();
    const response = await controller.deletePerson(req.params.employeeCode);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

export default router;

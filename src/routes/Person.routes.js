import express from 'express';
import { PersonController } from '../controller/Person.controller.js';

const router = express.Router();

// Create a new person
router.post('/', async (req, res) => {
  try {
    const controller = new PersonController(req.body);
    const response = await controller.create();
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Get all persons
router.get('/', async (_req, res) => {
  try {
    const controller = new PersonController();
    const response = await controller.getAll();
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Get person by employeeCode
router.get('/:employeeCode', async (req, res) => {
  try {
    const controller = new PersonController();
    const response = await controller.getByEmployeeCode(req.params.employeeCode);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Update person by employeeCode
router.put('/:employeeCode', async (req, res) => {
  try {
    const controller = new PersonController(req.body);
    const response = await controller.update(req.params.employeeCode);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

// Delete person by employeeCode
router.delete('/:employeeCode', async (req, res) => {
  try {
    const controller = new PersonController();
    const response = await controller.delete(req.params.employeeCode);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json(err);
  }
});

export default router;

import express from 'express';
import { PersonController } from '../controller/Person.controller.js';
import upload from '../middleware/multerConfig.js';
import { SchoolInfo } from '../controller/PersonSubClass.controller.js';

const router = express.Router();

// Create a new person
router.post('/', upload.single('userImage'), async (req, res) => {
  try {

    // Parse each field from req.body, defaulting to an empty object if not present
    const parseField = (field) => (req.body[field] ? JSON.parse(req.body[field]) : {});

    const personalInfo = parseField('personalInfo');
    const bankInfo = parseField('bankInfo');
    const toolInfo = parseField('toolInfo');
    const contactInfo = parseField('contactInfo');
    const reportingPersonInfo = parseField('reportingPersonInfo');
    const salaryInfo = parseField('salaryInfo');
    const certificates = parseField('certificates');
    const employeeHistory = parseField('employeeHistory');
    const healthCard = parseField('healthCard');
    const collegeInfo = parseField('collegeDetails');
    const schoolInfo = parseField('schoolInfo');

    const userImage = req.file ? `/User_Profile/${req.file.filename}` : null;

    // Set this.data to reuse your existing `createPerson()` logic
    const data = {
      personalInfo: { ...personalInfo, userImage },
      bankInfo,
      toolInfo,
      contactInfo,
      reportingPersonInfo: { selectedPersons: reportingPersonInfo.selectedPersons },
      salaryInfo,
      certificateInfo: { certificates },
      employeeHistoryInfo: { history: employeeHistory },
      healthCardInfo: { healthCard },
      schoolInfo: { schoolDetails: schoolInfo },
      collegeInfo: { collegeDetails: collegeInfo },
    };

    const controller = new PersonController(data);

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

router.get('/reporting', async (_req, res) => {
  try {
    const controller = new PersonController();
    const response = await controller.getReportingPersons();
    res.status(response.statusCode).json(response);
  }
  catch (err) {
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
router.put('/:employeeCode', upload.single('userImage'), async (req, res) => {
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

import Person from '../models/Person.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import axios from 'axios';
import {
  ReportingPerson,
  Certification,
  EmploymentHistory,
  HealthCardStatus,
  BankAccountInformation,
  ToolAccess,
  SalaryInformation,
} from './PersonSubClass.controller.js'; // adjust path accordingly
import { Mailer } from '../utils/Mailer.js'; // adjust path accordingly

export class PersonController {
  constructor(data) {
    this.data = data;
  }

  // CREATE
  async createPerson() {
    try {
      const {
        personalInfo,
        bankInfo,
        toolInfo,
        contactInfo,
        reportingPersonInfo,
        salaryInfo,
        certificateInfo,
        employeeHistoryInfo,
        collegeInfo,
        schoolInfo,
        healthCardInfo
      } = this.data;

      // Step 1: Build the person instance (with sub-schema classes)
      const newPerson = new Person({
        ...personalInfo,
        workMail: personalInfo.workMail,
        personalMail: contactInfo.personalMail,
        contactNo: contactInfo.contactNo,
        userImage: personalInfo.userImage || '',

        reportingPersons: Array.isArray(reportingPersonInfo?.selectedPersons)
          ? reportingPersonInfo.selectedPersons
            .filter(p => p && (p.employeeName || p.employeeCode))
            .map(p => new ReportingPerson(p))
          : [],

        certifications: Array.isArray(certificateInfo?.certificates)
          ? certificateInfo.certificates
          : [],

        employmentHistory: Array.isArray(employeeHistoryInfo?.history)
          ? employeeHistoryInfo.history
          : [],

        healthCardStatus: Array.isArray(healthCardInfo?.healthCard)
          ? healthCardInfo.healthCard.map(hc => new HealthCardStatus(hc))
          : [],

        collegeDetails: Array.isArray(collegeInfo.collegeDetails)
          ? collegeInfo.collegeDetails
          : [],

        schoolDetails: Array.isArray(schoolInfo.schoolDetails)
          ? schoolInfo.schoolDetails
          : [],

        bankAccountInformation: new BankAccountInformation(bankInfo),
        toolAccess: new ToolAccess(toolInfo),
        salaryInformation: new SalaryInformation(salaryInfo)
      });

      if (personalInfo.userImage) {
        const icon = `${this.data.protocol || 'http'}://${this.data.host || '192.168.1.60:5500'}${personalInfo.userImage}`;
        newPerson.userImage = icon;
      }

      // Step 2: Run Mongoose validation
      await newPerson.validate();

      // Step 3: Casdoor creation (only after validation)
      const userData = {
        name: this.data.personalInfo.firstName,
        password: this.#generatePassword(),
        email: this.data.personalInfo.workMail,
        displayName: this.data.personalInfo.firstName,
        signupApplication: 'IPMS_app',
      };

      // Step 4: Save the validated person to DB

      const casdoorInserted = await this.#createUserInCasdoor(userData);
      if (!casdoorInserted) {
        throw new ApiError(400, casdoorInserted.message || 'Failed to create Casdoor user');
      }

      const savedPerson = await newPerson.save();

      // // Send email with password
      try {
        await Mailer.sendEmail(userData.email, userData.password);
        console.log('sent mail');
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr.message);
      }

      return new ApiResponse(201, savedPerson, 'Employee created successfully');

    } catch (err) {
      // Custom validation error response
      if (err.name === 'ValidationError') {
        const fieldErrors = {};

        for (const [key, value] of Object.entries(err.errors)) {
          fieldErrors[key] = value.message;
        }

        console.log('Validation errors:', fieldErrors);

        throw new ApiError(422, 'Validation failed', fieldErrors, err.stack);
      }

      // Casdoor or unexpected errors
      if (err instanceof ApiError) throw err;

      throw new ApiError(500, 'Something went wrong', null, err.stack);
    }
  }


  // READ: Get All
  async getAllPerson() {
    try {
      const persons = await Person.find();
      return new ApiResponse(200, persons);
    } catch (err) {
      throw new ApiError(500, 'Failed to fetch persons', null, err.stack);
    }
  }

  // READ: Get employee data by Employee Code
  async getEmployeeByEmployeeCode(code) {
    try {
      const person = await Person.findOne({ employeeCode: code });
      if (!person) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, person);
    } catch (err) {
      throw new ApiError(err.statusCode || 500, err.message, null, err.stack);
    }
  }

  // READ: Get employee data by Work Email
  async getEmployeeByWorkEmail(email) {
    try {
      const person = await Person.findOne({ workMail: email });
      if (!person) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, person);
    } catch (err) {
      throw new ApiError(err.statusCode || 500, err.message, null, err.stack);
    }
  }

  // UPDATE
  async updatePerson(code) {
    try {
      const {
        personalInfo,
        contactInfo,
        reportingPersonInfo,
        certificateInfo,
        employmentHistoryInfo,
        healthCardInfo,
        collegeInfo,
        schoolInfo,
        bankInfo,
        toolInfo,
        salaryInfo,
      } = this.data;

      const updatedData = {
        ...personalInfo,
        workMail: personalInfo?.workMail,
        personalMail: contactInfo?.personalMail,
        contactNo: contactInfo?.contactNo,
        userImage: personalInfo?.userImage || '',

        reportingPersons: Array.isArray(reportingPersonInfo?.selectedPersons)
          ? reportingPersonInfo.selectedPersons.map(rp => new ReportingPerson(rp))
          : [],

        certifications: Array.isArray(certificateInfo?.certificates)
          ? certificateInfo.certificates.map(c => new Certification(c))
          : [],

        employmentHistory: Array.isArray(employmentHistoryInfo?.history)
          ? employmentHistoryInfo.history.map(eh => new EmploymentHistory(eh))
          : [],

        healthCardStatus: Array.isArray(healthCardInfo?.healthCard)
          ? healthCardInfo.healthCard.map(hc => new HealthCardStatus(hc))
          : [],

        collegeDetails: Array.isArray(collegeInfo?.collegeDetails)
          ? collegeInfo.collegeDetails
          : [],

        schoolDetails: Array.isArray(schoolInfo?.schoolDetails)
          ? schoolInfo.schoolDetails
          : [],

        bankAccountInformation: new BankAccountInformation(bankInfo || {}),
        toolAccess: new ToolAccess(toolInfo || {}),
        salaryInformation: new SalaryInformation(salaryInfo || {})
      };

      if (this.data.userImage) {
        const icon = `${this.data.protocol || 'http'}://${this.data.host || '192.168.1.60:5500'}${this.data.userImage}`;
        updatedData.userImage = icon;
      }

      const updated = await Person.findOneAndUpdate(
        { employeeCode: code },
        updatedData,
        { new: true }
      );

      if (!updated) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, updated, 'Employee updated successfully');
    } catch (err) {
      throw new ApiError(500, 'Error updating employee', null, err.stack);
    }
  }

  // DELETE
  async deletePerson(code) {
    try {
      const deleted = await Person.findOneAndDelete({ employeeCode: code });
      if (!deleted) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, deleted, 'Employee deleted successfully');
    } catch (err) {
      throw new ApiError(500, 'Error deleting employee', null, err.stack);
    }
  }

  // ------------------ PRIVATE ------------------ //

  #generatePassword(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }

  async #createUserInCasdoor(userData) {
    try {
      const response = await axios.post(`${process.env.APPSTORE_URL}/api/create-casdoor-user`, userData);
      if (response.data.success === true) {
        return true;
      } else {
        return {
          status: false,
          message: response.message
        };
      }
    } catch (err) {

      if (err.response && err.response.status === 400) {
        return {
          status: false,
          message: err.response.data.message || 'Failed to create Casdoor user'
        };
      }

      console.error('Casdoor:', err.response?.data || err.message);
      return false;
    }
  }
}

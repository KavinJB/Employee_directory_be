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
  SalaryInformation
} from './PersonSubClass.controller.js'; // adjust path accordingly
// import { Mailer } from '../utils/Mailer.js'; // adjust path accordingly

export class PersonController {
  constructor(data) {
    this.data = data;
  }

  // CREATE
  async createPerson() {
    try {
      // Step 1: Build the person instance (with sub-schema classes)

      // console.log('Creating person with data:', this.data);
      const newPerson = new Person({
        ...this.data.personalInfo,

        userImage: this.data.userImage || '', // Default to empty string if not provided
        workMail: this.data.personalInfo?.workMail,
        personalMail: this.data.contactInfo?.personalMail,
        contactNo: this.data.contactInfo?.contactNo,

        // Safe .map for reportingPersonInfo
        reportingPersons: this.data.reportingPersonInfo
          ? (Array.isArray(this.data.reportingPersonInfo)
            ? this.data.reportingPersonInfo.map(rp => new ReportingPerson(rp))
            : [new ReportingPerson(this.data.reportingPersonInfo)])
          : [],

        // Safe .map for certifications
        certifications: this.data.certificateInfo
          ? (Array.isArray(this.data.certificateInfo)
            ? this.data.certificateInfo.map(c => new Certification(c))
            : [new Certification(this.data.certificateInfo)])
          : [],

        // Safe .map for employmentHistory
        employmentHistory: this.data.employmentHistoryInfo
          ? (Array.isArray(this.data.employmentHistoryInfo)
            ? this.data.employmentHistoryInfo.map(eh => new EmploymentHistory(eh))
            : [new EmploymentHistory(this.data.employmentHistoryInfo)])
          : [],

        // Single-object embedded docs
        healthCardStatus: new HealthCardStatus(this.data.healthCardInfo || {}),
        bankAccountInformation: new BankAccountInformation(this.data.bankInfo || {}),
        toolAccess: new ToolAccess(this.data.toolInfo || {}),
        salaryInformation: new SalaryInformation(this.data.salaryInfo || {})
      });


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

      console.log(newPerson);

      const savedPerson = await newPerson.save();

      // // Send email with password
      // try {
      //   // await sendPasswordEmail(this.data.personalMail, userData.password);

      //   await Mailer.sendEmail(
      //     `${userData.email}`,
      //     'Welcome to Jupiter Brothers',
      //     'Your account has been created.',
      //     `
      //       <p>Hello,</p>
      //       <p>Your account has been created.</p>
      //       <p><strong>Email:</strong>${userData.email}</p>
      //       <p><strong>Password:</strong>${userData.password}</p>
      //     `
      //   );

      //   console.log('sent mail');
      // } catch (emailErr) {
      //   console.error('Failed to send email:', emailErr.message);
      //   // Optional: you can throw here if email must be mandatory
      // }

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

  // READ: Get by Employee Code
  async getByEmployeeCode(code) {
    try {
      const person = await Person.findOne({ employeeCode: code });
      if (!person) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, person);
    } catch (err) {
      throw new ApiError(err.statusCode || 500, err.message, null, err.stack);
    }
  }

  // READ: Get by Work Email
  async getByWorkEmail(email) {
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
      const updatedData = {
        ...this.data.personalInfo,

        workMail: this.data.personalInfo?.workMail,
        personalMail: this.data.contactInfo?.personalMail,
        contactNo: this.data.contactInfo?.contactNo,
        ...(this.data.reportingPersonInfo && {
          reportingPersons: this.data.reportingPersonInfo.map(rp => new ReportingPerson(rp)),
        }),
        ...(this.data.certificateInfo && {
          certifications: this.data.certificateInfo.map(c => new Certification(c)),
        }),
        ...(this.data.employmentHistoryInfo && {
          employmentHistory: this.data.employmentHistoryInfo.map(eh => new EmploymentHistory(eh)),
        }),
        ...(this.data.healthCardInfo && {
          healthCardStatus: new HealthCardStatus(this.data.healthCardInfo),
        }),
        ...(this.data.bankInfo && {
          bankAccountInformation: new BankAccountInformation(this.data.bankInfo),
        }),
        ...(this.data.toolInfo && {
          toolAccess: new ToolAccess(this.data.toolInfo),
        }),
        ...(this.data.salaryInfo && {
          salaryInformation: new SalaryInformation(this.data.salaryInfo),
        }),
      };
      
      if (this.data.userImage) {
        updatedData.userImage = this.data.userImage;
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

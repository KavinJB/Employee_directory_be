import Person from '../models/Person.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import axios from 'axios';

export class PersonController {
  constructor(data) {
    this.data = data;
  }

  async createPerson() {
    try {
      const userData = {
        name: this.data.firstName,
        password: this.#generatePassword(),
        email: this.data.workEmail,
        displayName: this.data.firstName,
        signupApplication: 'IPMS_app',
      };

      const casdoorInserted = await this.#createUserInCasdoor(userData);
      if (!casdoorInserted) {
        console.log(casdoorInserted.message);        
        throw new ApiError(400, casdoorInserted.message);
      }

      console.log(casdoorInserted);      

      const newPerson = new Person({
        ...this.data,
      });

      const savedPerson = await newPerson.save();

      return new ApiResponse(201, savedPerson, 'Employee created successfully');
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(400, err.message, err.errors, err.stack);
    }
  }

  async getAllPerson() {
    try {
      const persons = await Person.find();
      return new ApiResponse(200, persons);
    } catch (err) {
      throw new ApiError(500, 'Failed to fetch persons', null, err.stack);
    }
  }

  async getByEmployeeCode(code) {
    try {
      const person = await Person.findOne({ employeeCode: code });
      if (!person) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, person);
    } catch (err) {
      throw new ApiError(err.statusCode || 500, err.message, null, err.stack);
    }
  }

  async updatePerson(code) {
    try {
      const updated = await Person.findOneAndUpdate({ employeeCode: code }, this.data, { new: true });
      if (!updated) throw new ApiError(404, 'Employee not found');
      return new ApiResponse(200, updated, 'Employee updated successfully');
    } catch (err) {
      throw new ApiError(500, 'Error updating employee', null, err.stack);
    }
  }

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
    console.log(password);
    return password;
  }

  async #createUserInCasdoor(userData) {
    try {
      const response = await axios.post('http://localhost:3000/api/create-casdoor-user', userData);      
      if(response.data.success == true){
        return true;
      }
      else{
        return{
          status: false,
          message: response.data.msg
        }
      }
    } catch (err) {
      console.error('Casdoor Error:', err.response?.data || err.message);
      return false;
    }
  }
}

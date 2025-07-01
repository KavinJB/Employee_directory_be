import Person from '../models/Person.model.js';

class PersonService {
  // Create a new person
  static async createPerson(data) {
    const newPerson = new Person(data);
    return await newPerson.save();
  }

  // Fetch all persons
  static async getAllPersons() {
    return await Person.find();
  }

  // Find a person by employee code
  static async getPersonByCode(code) {
    return await Person.findOne({ employeeCode: code });
  }

  // Update a person by employee code
  static async updatePerson(code, data) {
    return await Person.findOneAndUpdate({ employeeCode: code }, data, { new: true });
  }

  // Delete a person by employee code
  static async deletePerson(code) {
    return await Person.findOneAndDelete({ employeeCode: code });
  }
}

export default PersonService;

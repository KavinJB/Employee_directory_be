import Person from "../models/Person.model.js";

// personSubSchemas.js
export class ReportingPerson {
  constructor({ employeeName, designation, employeeCode }) {
    this.employeeName = employeeName;
    this.designation = designation;
    this.employeeCode = employeeCode;
  }

  // READ: Get Reporting Persons
  static async getReportingPersons() {
    try {
      const persons = await Person.find().select('employeeCode firstName lastName userImage currentPosition positionJoined');
      return new ApiResponse(200, persons);
    } catch (err) {
      throw new ApiError(500, 'Failed to fetch reporting persons', null, err.stack);
    }
  }
}

export class Certification {
  constructor({ certificationName, startDate, endDate, certificateLink = '' }) {
    this.certificationName = certificationName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.certificateLink = certificateLink;
  }
}

export class EmploymentHistory {
  constructor({ companyName, designation, startDate, endDate, }) {
    this.companyName = companyName;
    this.designation = designation;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class HealthCardStatus {
  constructor({ groupName, ergoId, memberName, gender, amount, status = 'pending' }) {
    this.groupName = groupName;
    this.ergoId = ergoId;
    this.memberName = memberName;
    this.gender = gender;
    this.amount = amount;
    this.status = status;
  }
}

export class BankAccountInformation {
  constructor({ panNumber, aadharNumber, bankAccountNumber, bankName, ifscCode, passbookName, uanNumber }) {
    this.panNumber = panNumber;
    this.aadharNumber = aadharNumber;
    this.bankAccountNumber = bankAccountNumber;
    this.bankName = bankName;
    this.ifscCode = ifscCode;
    this.passbookName = passbookName;
    this.uanNumber = uanNumber;
  }
}

export class ToolAccess {
  constructor({
    repositoryManagement = [],
    employeeDirectory = [],
    projectOrderSheet = [],
    projectCostingSheet = [],
    timesheet = [],
    billingPlan = [],
    paymentTracking = [],
    dashboard = []
  }) {
    this.repositoryManagement = repositoryManagement;
    this.employeeDirectory = employeeDirectory;
    this.projectOrderSheet = projectOrderSheet;
    this.projectCostingSheet = projectCostingSheet;
    this.timesheet = timesheet;
    this.billingPlan = billingPlan;
    this.paymentTracking = paymentTracking;
    this.dashboard = dashboard;
  }
}

export class SalaryInformation {
  constructor({ designation, salaryInLpa, ctsb, variablePay, lastUpdated = new Date() }) {
    this.designation = designation;
    this.salaryInLpa = salaryInLpa;
    this.ctsb = ctsb;
    this.variablePay = variablePay;
    this.lastUpdated = lastUpdated;
  }
}


export class CollegeInfo {
  constructor({ degree, collegeName, degreeProgram, startDate, endDate }) {
    this.degree = degree;
    this.collegeName = collegeName;
    this.degreeProgram = degreeProgram;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class SchoolInfo {
  constructor({ schoolName, schoolLevel, startDate, endDate }) {
    this.schoolName = schoolName;
    this.schoolLevel = schoolLevel;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

// export class AdminCheckList {
//   constructor({
//     system = false,
//     software = false,
//     timesheet = false,
//     attendance = false,
//     businessCard = false,
//     whatsapp = false,
//     mailId = false,
//     mailSignature = false,
//     mailGroups = false,
//     bioMetric = false,
//     diary = false
//   }) {
//     this.system = system;
//     this.software = software;
//     this.timesheet = timesheet;
//     this.attendance = attendance;
//     this.businessCard = businessCard;
//     this.whatsapp = whatsapp;
//     this.mailId = mailId;
//     this.mailSignature = mailSignature;
//     this.mailGroups = mailGroups;
//     this.bioMetric = bioMetric;
//     this.diary = diary;
//   }
// }

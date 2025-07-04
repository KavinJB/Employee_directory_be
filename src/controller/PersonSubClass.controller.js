// personSubSchemas.js
export class ReportingPerson {
  constructor({ employeeName, designation, employeeCode }) {
    this.employeeName = employeeName;
    this.designation = designation;
    this.employeeCode = employeeCode;
  }
}

export class Certification {
  constructor({ certificationName, duration, certificateLink = '' }) {
    this.certificationName = certificationName;
    this.duration = duration;
    this.certificateLink = certificateLink;
  }
}

export class EmploymentHistory {
  constructor({ companyName, designation, duration }) {
    this.companyName = companyName;
    this.designation = designation;
    this.duration = duration;
  }
}

export class HealthCardStatus {
  constructor({ cardName, groupName, employeeId, memberName, gender, amount, status = 'pending' }) {
    this.cardName = cardName;
    this.groupName = groupName;
    this.employeeId = employeeId;
    this.memberName = memberName;
    this.gender = gender;
    this.amount = amount;
    this.status = status;
  }
}

export class BankAccountInformation {
  constructor({ panNumber, aadharNumber, bankAccountNumber, bankName, ifscCode, nameAsPerPassbook, uanNumber }) {
    this.panNumber = panNumber;
    this.aadharNumber = aadharNumber;
    this.bankAccountNumber = bankAccountNumber;
    this.bankName = bankName;
    this.ifscCode = ifscCode;
    this.nameAsPerPassbook = nameAsPerPassbook;
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
  constructor({ designation, perHrCost, lastUpdated = new Date() }) {
    this.designation = designation;
    this.perHrCost = perHrCost;
    this.lastUpdated = lastUpdated;
  }
}

export class AdminCheckList {
  constructor({
    system = false,
    software = false,
    timesheet = false,
    attendance = false,
    businessCard = false,
    whatsapp = false,
    mailId = false,
    mailSignature = false,
    mailGroups = false,
    bioMetric = false,
    diary = false
  }) {
    this.system = system;
    this.software = software;
    this.timesheet = timesheet;
    this.attendance = attendance;
    this.businessCard = businessCard;
    this.whatsapp = whatsapp;
    this.mailId = mailId;
    this.mailSignature = mailSignature;
    this.mailGroups = mailGroups;
    this.bioMetric = bioMetric;
    this.diary = diary;
  }
}

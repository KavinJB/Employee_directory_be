// person.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// --- Sub-Schemas ---
const ReportingPersonSchema = new Schema({
  employeeName: { type: String, },
  designation: { type: String,  },
  employeeCode: { type: String, }
}, { _id: false });

const CertificationSchema = new Schema({
  certificationName: { type: String,  },
  duration: { type: String,  },
  certificateLink: { type: String, default: '' }
}, { _id: false });

const EmploymentHistorySchema = new Schema({
  companyName: { type: String, required: true },
  designation: { type: String, required: true },
  duration: { type: String, required: true }
}, { _id: false });

const HealthCardStatusSchema = new Schema({
  cardName: String,
  groupName: String,
  employeeId: String,
  memberName: String,
  gender: String,
  amount: String,
  status: { type: String, default: 'pending' }
}, { _id: false });

const BankAccountInformationSchema = new Schema({
  panNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  bankAccountNumber: String,
  bankName: String,
  ifscCode: String,
  PassbookName: String,
  uanNumber: String
}, { _id: false });

const ToolAccessSchema = new Schema({
  repositoryManagement: { type: [String], default: [] },
  employeeDirectory: { type: [String], default: [] },
  projectOrderSheet: { type: [String], default: [] },
  projectCostingSheet: { type: [String], default: [] },
  timesheet: { type: [String], default: [] },
  billingPlan: { type: [String], default: [] },
  paymentTracking: { type: [String], default: [] },
  dashboard: { type: [String], default: [] }
}, { _id: false });

const SalaryInformationSchema = new Schema({
  designation: { type: String, required: true },
  perHrCost: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

// const AdminCheckListSchema = new Schema({
//   system: { type: Boolean, default: false },
//   software: { type: Boolean, default: false },
//   timesheet: { type: Boolean, default: false },
//   attendance: { type: Boolean, default: false },
//   businessCard: { type: Boolean, default: false },
//   whatsapp: { type: Boolean, default: false },
//   mailId: { type: Boolean, default: false },
//   mailSignature: { type: Boolean, default: false },
//   mailGroups: { type: Boolean, default: false },
//   bioMetric: { type: Boolean, default: false },
//   diary: { type: Boolean, default: false }
// }, { _id: false });

// --- Main Person Schema ---
const PersonSchema = new Schema({
  // --- Personal Details (Required) ---
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  workMail: { type: String, required: true, unique: true },
  contactNo: { type: String, required: true },
  personalMail: { type: String, required: true },
  userImage: { type: String, default: '' }, // URL or path to the image

  // --- Personal Details (Optional) ---
  gender: String,
  fatherName: String,
  motherName: String,
  bloodGroup: String,
  dob: Date,
  maritalStatus: { type: String, default: 'single' },
  // nationality: { type: String, default: 'Indian' },

  // --- Employment Details (Required) ---
  organization: { type: String, required: true },
  businessUnit: { type: String, required: true },
  serviceUnit: { type: String, required: true },
  // designation: { type: String, required: true },
  positionJoined: { type: String, required: true },

  // --- Auto create while employee DB.Save() ---
  employeeCode: { type: String, unique: true },

  // --- Employment Details (Optional) ---
  employmentType: String,
  branch: String,
  doj: String,
  currentStatus: { type: String, default: 'active' },
  currentPosition: String,
  dol: String,
  access_level: { type: String, default: 'user' },

  // --- Related Sub-Documents ---
  reportingPersons: { type: [ReportingPersonSchema], default: [] },
  certifications: { type: [CertificationSchema], default: [] },
  employmentHistory: { type: [EmploymentHistorySchema], default: [] },
  healthCardStatus: HealthCardStatusSchema,
  bankAccountInformation: BankAccountInformationSchema,
  toolAccess: ToolAccessSchema,
  salaryInformation: SalaryInformationSchema,
  // adminCheckList: AdminCheckListSchema
}, { timestamps: true });


// --- Auto-increment employeeCode based on last record ---
PersonSchema.pre('save', async function (next) {
  if (this.employeeCode) return next();

  try {
    const lastPerson = await mongoose.model('Person').findOne().sort({ employeeCode: -1 }).exec();
    const lastCode = lastPerson?.employeeCode;
    const nextCode = lastCode ? String(Number(lastCode) + 1) : '1000';
    this.employeeCode = nextCode;
    next();
  } catch (err) {
    next(err);
  }
});

const Person = model('Person', PersonSchema);
export default Person;

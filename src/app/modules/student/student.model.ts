import { Schema, model } from 'mongoose'
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  // TStudentMethods,
  TStudentModel,
  TUserName,
} from './student.interface'
import validator from 'validator'

const nameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [20, 'first name can not be more then 20 character'],
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [20, 'last name can not be more then 20 character'],
  },
  lastName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'last name can not be more then 20 character'],
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No is required'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No is required'],
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required'] },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact No is required'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required'],
  },
})

//main schema
const studentSchema = new Schema<TStudent, TStudentModel>(
  {
    id: {
      type: String,
      unique: true,
      required: [true, 'Can not accept duplicate id'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'UserModel',
    },
    name: { type: nameSchema, required: true },
    email: {
      type: String,
      unique: true,
      required: [true, 'Can not accept duplicate email'],
      validate: { validator: (value: string) => validator.isEmail(value) },
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    dateOfBirth: { type: String },
    contactNumber: { type: String, required: [true, 'contact no is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact no is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is required'],
    },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String, default: '' },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

//virtual
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
})

//creating a custom static method
studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await StudentModel.findOne({ id })
  return existingUser
}

// query pre middleware
studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } }) //filter get all student data
  next()
})
studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } }) //filter get single student data
  next()
})
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } }) //filter get single student data using aggregation
  next()
})
//create model
export const StudentModel = model<TStudent, TStudentModel>(
  'Student',
  studentSchema,
)

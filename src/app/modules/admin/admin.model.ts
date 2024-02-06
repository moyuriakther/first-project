import { Schema, model } from 'mongoose'
import validator from 'validator'
import { TAdmin, TAdminModel, TAdminName } from './admin.interface'

const nameSchema = new Schema<TAdminName>({
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
const adminSchema = new Schema<TAdmin, TAdminModel>(
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
    designation: {
      type: String,
      required: [true, 'Designation  is required'],
    },
    name: { type: nameSchema, required: true },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      unique: true,
      required: [true, 'Can not accept duplicate email'],
      validate: { validator: (value: string) => validator.isEmail(value) },
    },
    contactNo: { type: String, required: [true, 'contact no is required'] },
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
    profileImg: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

//creating a custom static method
adminSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await AdminModel.findOne({ id })
  return existingUser
}

//create model
export const AdminModel = model<TAdmin, TAdminModel>('admin', adminSchema)

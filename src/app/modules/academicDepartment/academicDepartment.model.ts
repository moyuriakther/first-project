import { Schema, model } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
)

//before add a department checking is that department exist
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartmentModel.findOne({
    name: this.name,
  })
  if (isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Department already exist')
  }
  next()
})

//before updating checking is that department exist
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery()
  const exist = await AcademicDepartmentModel.findOne({ query })
  if (!exist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Department is not Exist into Database',
    )
  }
  next()
})

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
)

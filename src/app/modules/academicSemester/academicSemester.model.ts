import { Schema, model } from 'mongoose'
import { TAcademicSemester } from './academicSemester.interface'
import { Months } from './academicSemester.const'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: ['Summer', 'Fall', 'Winter'],
      required: true,
    },
    code: {
      type: String,
      enum: ['01', '02', '03'],
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

//using pre hook middleware to check this year this semester existence
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  })
  if (isSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester already exist ')
  }
  next()
})

// Or

//compound unique index on name year code, to check this year this semester existence
academicSemesterSchema.index({ name: 1, year: 1 }, { unique: true })

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
)

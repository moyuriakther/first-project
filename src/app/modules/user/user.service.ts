import httpStatus from 'http-status'
import config from '../../config'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { StudentModel } from '../student/student.model'
import { TUser } from './user.interface'
import { UserModel } from './user.model'
import { generateStudentId } from './user.utils'
import AppError from '../../errors/AppError'
import mongoose from 'mongoose'

const createStudentInfoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {}
  // if password not given use default password
  userData.password = password || (config.default_pass as string)
  userData.role = 'student' //set student role

  // first academic semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  )

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    userData.id = await generateStudentId(admissionSemester) //set generated id
    //create a user
    const newUser = await UserModel.create([userData], { session }) // built in static method

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // create a student
    if (newUser.length) {
      //set id, _id as user to student data
      payload.id = newUser[0].id
      payload.user = newUser[0]._id //reference id
      const newStudent = await StudentModel.create([payload], { session })
      if (!newStudent) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student')
      }
      await session.commitTransaction()
      await session.endSession()
      return newStudent
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Create Student')
  }
}
export const UserServices = {
  createStudentInfoDB,
}

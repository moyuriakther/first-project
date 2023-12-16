import httpStatus from 'http-status'
import config from '../../config'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { StudentModel } from '../student/student.model'
import { TUser } from './user.interface'
import { UserModel } from './user.model'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'
import AppError from '../../errors/AppError'
import mongoose from 'mongoose'
import { TFaculty } from '../faculty/faculty.interface'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { FacultyModel } from '../faculty/faculty.model'
import { TAdmin } from '../admin/admin.interface'
import { AdminModel } from '../admin/admin.model'

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
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const facultyData: Partial<TUser> = {}
  // if password not given use default password

  facultyData.password = password || (config.default_pass as string)
  facultyData.role = 'faculty' //set faculty role

  // first academic semester info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    facultyData.id = await generateFacultyId() //set generated id
    //create a user
    const newUser = await UserModel.create([facultyData], { session }) // built in static method
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // create a faculty
    if (newUser.length) {
      //set id, _id as user to faculty data
      payload.id = newUser[0].id
      payload.user = newUser[0]._id //reference id
      const newFaculty = await FacultyModel.create([payload], { session })
      if (!newFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty')
      }
      await session.commitTransaction()
      await session.endSession()
      return newFaculty
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Create Faculty')
  }
}
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const adminData: Partial<TUser> = {}
  // if password not given use default password
  // console.log(payload, password)
  adminData.password = password || (config.default_pass as string)
  adminData.role = 'admin' //set admin role
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    adminData.id = await generateAdminId() //set generated id
    //create a user
    const newUser = await UserModel.create([adminData], { session }) // built in static method

    if (!newUser || !newUser?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // create a faculty
    if (newUser.length) {
      //set id, _id as user to faculty data
      payload.id = newUser[0].id
      payload.user = newUser[0]._id //reference id
      const newAdmin = await AdminModel.create([payload], { session })

      if (!newAdmin) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin')
      }
      await session.commitTransaction()
      await session.endSession()
      return newAdmin
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Create Admin')
  }
}
export const UserServices = {
  createStudentInfoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
}

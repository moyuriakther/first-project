/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { sendImgToCloudinary } from '../../utils/sendImgToCloudinary'

const createStudentInfoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  const userData: Partial<TUser> = {}
  // if password not given use default password
  userData.password = password || (config.default_pass as string)
  userData.role = 'student' //set student role
  userData.email = payload.email

  // first academic semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  )

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found')
  }

  // find department
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  )
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission Department not found')
  }
  //save academic faculty find from academicDepartment
  payload.academicFaculty = academicDepartment.academicFaculty

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    userData.id = await generateStudentId(admissionSemester) //set generated id

    if (file) {
      const path = file?.path
      const imageName = `${userData?.id}${payload.name.firstName}`
      //send image to cloudinary
      const { secure_url } = await sendImgToCloudinary(path, imageName)
      payload.profileImg = secure_url as string // set profile image link
    }

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
const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const facultyData: Partial<TUser> = {}
  // if password not given use default password

  facultyData.password = password || (config.default_pass as string)
  facultyData.role = 'faculty' //set faculty role
  facultyData.email = payload.email

  // first academic semester info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }
  payload.academicFaculty = academicDepartment.academicFaculty

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    facultyData.id = await generateFacultyId() //set generated id

    if (file) {
      const path = file?.path
      const imageName = `${facultyData?.id}${payload.name.firstName}`
      //send image to cloudinary
      const { secure_url } = await sendImgToCloudinary(path, imageName)
      payload.profileImg = secure_url as string // set profile image link
    }

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
const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  const adminData: Partial<TUser> = {}
  // if password not given use default password
  console.log(payload, password)
  adminData.password = password || (config.default_pass as string)
  adminData.role = 'admin' //set admin role
  adminData.email = payload.email //set admin email

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    adminData.id = await generateAdminId() //set generated id

    if (file) {
      const path = file?.path
      const imageName = `${adminData?.id}${payload.name.firstName}`
      //send image to cloudinary
      const { secure_url } = await sendImgToCloudinary(path, imageName)
      payload.profileImg = secure_url as string // set profile image link
    }

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
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}
const getMe = async (id: string, role: string) => {
  let result = null
  if (role === 'student') {
    result = await StudentModel.findOne({ id }).populate('user')
  }
  if (role === 'faculty') {
    result = await FacultyModel.findOne({ id }).populate('user')
  }
  if (role === 'admin') {
    result = await AdminModel.findOne({ id }).populate('user')
  }
  return result
}
export const UserServices = {
  createStudentInfoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  changeStatus,
  getMe,
}

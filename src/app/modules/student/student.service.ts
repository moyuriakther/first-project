import mongoose from 'mongoose'
import { StudentModel } from './student.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'
import { TStudent } from './student.interface'

const getAllStudentInfoFromDB = async () => {
  const result = await StudentModel.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    })
  return result
}

const getSingleStudentInfoFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    })
  // const result = await StudentModel.aggregate([{ $match: { id: id } }])
  return result
}
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  if (!(await StudentModel.isUserExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }

  const { name, guardian, localGuardian, ...remaining } = payload
  const modifiedUpdatedData: Record<string, unknown> = { ...remaining }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value
    }
  }

  const result = await StudentModel.findOneAndUpdate(
    { id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  )
  return result
}

const deleteStudentInfoFromDb = async (id: string) => {
  //checking user is exist or not using static method and if user not exist throw an error message
  if (!(await StudentModel.isUserExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const deleteStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )
    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student ')
    }
    const deleteUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User ')
    }
    await session.commitTransaction()
    await session.endSession()
    return deleteStudent
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Delete Student')
  }
}

export const StudentServices = {
  getAllStudentInfoFromDB,
  getSingleStudentInfoFromDb,
  updateStudentIntoDB,
  deleteStudentInfoFromDb,
}

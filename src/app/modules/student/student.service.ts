import mongoose from 'mongoose'
import { StudentModel } from './student.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'
import { TStudent } from './student.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchableFields } from './student.constant'

const getAllStudentInfoFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query }
  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress']
  // let searchTerm = ''
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string
  // }
  // const searchQuery = StudentModel.find({
  //   $or: studentSearchableFields?.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // })
  // // filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
  // excludeFields?.forEach((el) => delete queryObj[el])

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: { path: 'academicFaculty' },
  //   })

  // let sort = '-createdAt'
  // if (query?.sort) {
  //   sort = query?.sort as string
  // }
  // const sortQuery = filterQuery.sort(sort)
  // let limit = 1
  // if (query?.limit) {
  //   limit = Number(query?.limit)
  // }
  // let page = 1
  // let skip = 0
  // if (query?.page) {
  //   page = Number(query?.page)
  //   skip = (page - 1) * limit
  // }
  // const paginateQuery = sortQuery.skip(skip)
  // const limitQuery = paginateQuery.limit(limit)
  // let fields = '-__v'
  // if (query?.fields) {
  //   fields = (query.fields as string).split(',').join(' ')
  // }
  // const fieldQuery = await limitQuery.select(fields)

  // return fieldQuery

  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await studentQuery.modelQuery
  return result
}

const getSingleStudentInfoFromDb = async (id: string) => {
  const result = await StudentModel.findById(id)
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

  const result = await StudentModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
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
    const deleteStudent = await StudentModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )
    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student ')
    }
    const userId = deleteStudent?.user
    const deleteUser = await UserModel.findByIdAndUpdate(
      userId,
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

import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { FacultyModel } from './faculty.model'
import { TFaculty } from './faculty.interface'
import { facultySearchableFields } from './faculty.constant'

const getAllFacultyInfoFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    FacultyModel.find().populate('academicDepartment'),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await facultyQuery.modelQuery
  const meta = await facultyQuery.countTotal()

  return { meta, result }
}

const getSingleFacultyInfoFromDb = async (id: string) => {
  const result = await FacultyModel.findById(id).populate('academicDepartment')

  return result
}
const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  if (!(await FacultyModel.isUserExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }
  const { name, ...remaining } = payload
  const modifiedUpdatedData: Record<string, unknown> = { ...remaining }

  if (name && Object?.keys(name)?.length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteFacultyInfoFromDb = async (id: string) => {
  //checking user is exist or not using static method and if user not exist throw an error message
  if (!(await FacultyModel.isUserExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const deleteFaculty = await FacultyModel.findByIdAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )
    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Faculty ')
    }
    const userId = deleteFaculty.user
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
    return deleteFaculty
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Delete Faculty')
  }
}

export const FacultyServices = {
  getAllFacultyInfoFromDB,
  getSingleFacultyInfoFromDb,
  updateFacultyIntoDB,
  deleteFacultyInfoFromDb,
}

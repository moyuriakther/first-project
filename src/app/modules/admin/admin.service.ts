import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { AdminModel } from './admin.model'
import { adminSearchableFields } from './admin.constant'
import { TAdmin } from './admin.interface'

const getAllAdminInfoFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(AdminModel.find(), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await adminQuery.modelQuery
  return result
}

const getSingleAdminInfoFromDb = async (id: string) => {
  const result = await AdminModel.findById(id)
  return result
}
const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  if (!(await AdminModel.isUserExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found')
  }
  const { name, ...remaining } = payload
  const modifiedUpdatedData: Record<string, unknown> = { ...remaining }

  if (name && Object?.keys(name)?.length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await AdminModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteAdminInfoFromDb = async (id: string) => {
  //checking user is exist or not using static method and if user not exist throw an error message
  if (!(await AdminModel.isUserExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found')
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const deleteAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )
    if (!deleteAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin ')
    }
    const adminId = deleteAdmin?.user
    const deleteUser = await UserModel.findOneAndUpdate(
      adminId,
      { isDeleted: true },
      { new: true, session },
    )
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User ')
    }
    await session.commitTransaction()
    await session.endSession()
    return deleteAdmin
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Delete Admin')
  }
}

export const AdminServices = {
  getAllAdminInfoFromDB,
  getSingleAdminInfoFromDb,
  updateAdminIntoDB,
  deleteAdminInfoFromDb,
}

import { OfferedCourseModel } from './../offeredCourse/offeredCourse.model'
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistrationModel } from './semesterRegistration.model'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { registrationStatus } from './semesterRegistration.constant'
import mongoose from 'mongoose'

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  //check if there any registered semester already 'UPCOMING'|'ONGOING'
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: registrationStatus.UPCOMING },
        { status: registrationStatus.ONGOING },
      ],
    })
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} Registered Semester !`,
    )
  }
  //check if the semester exist
  const academicSemester = payload?.academicSemester
  const isAcademicSemesterExists =
    await AcademicSemesterModel.findById(academicSemester)

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not exist')
  }
  //check if this semester already registered
  const isSemesterAlreadyRegistered = await SemesterRegistrationModel.findOne({
    academicSemester,
  })
  if (isSemesterAlreadyRegistered) {
    throw new AppError(httpStatus.CONFLICT, 'Semester Already Registered')
  }

  const result = await SemesterRegistrationModel.create(payload)
  return result
}
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegisterQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await semesterRegisterQuery.modelQuery
  return result
}
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistrationModel.findById(id).populate('academicSemester')
  return result
}
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check that semester is exist or not
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(id)
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, `This Semester is not found`)
  }

  //check is that semester already ended
  const currentSemesterStatus = isSemesterRegistrationExists?.status
  if (currentSemesterStatus === registrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This Semester is already ${currentSemesterStatus}`,
    )
  }
  const requestedStatus = payload.status

  if (
    currentSemesterStatus === registrationStatus.UPCOMING &&
    requestedStatus === registrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Can't Change Semester Registration Status Directly From ${currentSemesterStatus} To ${requestedStatus}`,
    )
  }

  if (
    currentSemesterStatus === registrationStatus.ONGOING &&
    requestedStatus === registrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Can't Change Semester Registration Status From ${currentSemesterStatus} To ${requestedStatus}`,
    )
  }
  //update
  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  )
  return result
}
const deleteSemesterRegistrationFromDB = async (id: string) => {
  //check that semester is exist or not
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(id)

  const isSemesterRegistrationStatus = isSemesterRegistrationExists?.status
  //checking semester registration status
  if (isSemesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not Delete this Semester as it is ${isSemesterRegistrationStatus}!`,
    )
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    //find all offered course thats are depending on this semester registration
    const offeredCourseToDeleted = await OfferedCourseModel.find({
      semesterRegistration: id,
    })
    //delete all offered course that are depending on this semester registration
    const deleteAllOfferedCourseDependingOnThisSemesterRegistration =
      await OfferedCourseModel.deleteMany(
        {
          _id: { $in: offeredCourseToDeleted.map((el) => el._id) },
        },
        { session },
      )
    if (!deleteAllOfferedCourseDependingOnThisSemesterRegistration) {
      throw new Error(
        'Failed to Delete Offered Courses Depending On Semester Registration',
      )
    }
    //now delete semester registration
    const deleteSemesterRegistration =
      await SemesterRegistrationModel.findByIdAndDelete(id, {
        new: true,
        session,
      })
    if (!deleteSemesterRegistration) {
      throw new Error('Failed to Delete Semester Registrations')
    }
    await session.commitTransaction()
    await session.endSession()
    return {
      deleteAllOfferedCourseDependingOnThisSemesterRegistration,
      deleteSemesterRegistration,
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to Delete Semester Registration here')
  }
}

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
}

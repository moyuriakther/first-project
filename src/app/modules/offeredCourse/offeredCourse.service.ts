import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { OfferedCourseModel } from './offeredCourse.model'
import { FacultyModel } from '../faculty/faculty.model'
import { CourseModel } from '../Course/course.model'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model'
import { hasTimeConflict } from './offeredCourse.utils'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration)
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration Not Found')
  }
  const academicSemester = isSemesterRegistrationExist.academicSemester

  const isAcademicFacultyExist =
    await AcademicFacultyModel.findById(academicFaculty)
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty Not Found')
  }
  const isAcademicDepartmentExist =
    await AcademicDepartmentModel.findById(academicDepartment)
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not Found')
  }
  const isCourseExist = await CourseModel.findById(course)
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course Not Found')
  }
  const isFacultyExist = await FacultyModel.findById(faculty)
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found')
  }

  const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty: academicFaculty,
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExist.name} Department is not belong to ${isAcademicFacultyExist.name} Faculty`,
    )
  }
  const isSameOfferedCourseExistWithSameRegisteredSemesterWithSameSection =
    await OfferedCourseModel.findOne({
      course,
      semesterRegistration,
      section,
    })
  if (isSameOfferedCourseExistWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist!`,
    )
  }
  //check faculty assign schedules
  const facultyAssignedSchedules = await OfferedCourseModel.find({
    faculty,
    semesterRegistration,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(facultyAssignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This Faculty  is not available at this time! Choose another time or this day!`,
    )
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  })
  return result
}
const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const semesterRegisterQuery = new QueryBuilder(
    OfferedCourseModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await semesterRegisterQuery.modelQuery
  const meta = await semesterRegisterQuery.countTotal()
  return { meta, result }
}
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result =
    await OfferedCourseModel.findById(id).populate('academicSemester')
  return result
}
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'startTime' | 'endTime' | 'days'>,
) => {
  //check that semester is exist or not
  const { faculty, startTime, endTime, days } = payload
  const isOfferedCourseExist = await OfferedCourseModel.findById(id)
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found')
  }
  const isFacultyExist = await FacultyModel.findById(faculty)
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found')
  }
  const semesterRegistration = isOfferedCourseExist.semesterRegistration
  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration)
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course  as it is ${semesterRegistrationStatus?.status}!`,
    )
  }
  //check faculty assign schedules
  const facultyAssignedSchedules = await OfferedCourseModel.find({
    faculty,
    semesterRegistration,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(facultyAssignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This Faculty  is not available at this time! Choose another time or this day!`,
    )
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}
const deleteOfferedCourseFromDB = async (id: string) => {
  //check that semester is exist or not
  const isOfferedCourseExist = await OfferedCourseModel.findById(id)
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found')
  }

  const semesterRegistration = isOfferedCourseExist.semesterRegistration
  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration).select(
      'status',
    )

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not Delete this offered course  as it is ${semesterRegistrationStatus?.status}!`,
    )
  }
  const result = await OfferedCourseModel.findByIdAndDelete(id, {
    new: true,
  })
  return result
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
}

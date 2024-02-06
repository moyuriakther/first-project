/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { StudentModel } from '../student/student.model'
import { EnrolledCourseModel } from './enrolledCourse.model'
import mongoose from 'mongoose'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { CourseModel } from '../Course/course.model'
import { FacultyModel } from '../faculty/faculty.model'
import { calculateGradeAndPoints } from './enrolledCourse.utils'

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */
  const { offeredCourse } = payload
  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse)
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found')
  }

  if (isOfferedCourseExist?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full')
  }

  const student = await StudentModel.findOne({ id: userId }, { _id: 1 })
  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    student: student?._id,
    semesterRegistration: isOfferedCourseExist?.semesterRegistration,
    offeredCourse,
  })
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student Already Enrolled')
  }
  //check total credit exceed maxCredit
  const course = await CourseModel.findById(
    isOfferedCourseExist?.course,
  ).select('credits')
  const newCourseCredit = course?.credits

  const maxCredit = await SemesterRegistrationModel.findById(
    isOfferedCourseExist?.semesterRegistration,
  ).select('maxCredit')

  const maxCredits = maxCredit?.maxCredit

  //calculate total enrolled course credit
  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExist?.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    { $project: { _id: 0, totalEnrolledCredits: 1 } },
  ])
  //total enrolled credit + new enrolled credit > maxCredit
  const totalCredits =
    enrolledCourses?.length > 0 ? enrolledCourses[0]?.totalEnrolledCredits : 0

  if (
    totalCredits &&
    maxCredits &&
    totalCredits + newCourseCredit > maxCredits
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits',
    )
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExist?.semesterRegistration,
          academicSemester: isOfferedCourseExist?.academicSemester,
          academicFaculty: isOfferedCourseExist?.academicFaculty,
          academicDepartment: isOfferedCourseExist?.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExist?.course,
          student: student?._id,
          faculty: isOfferedCourseExist?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    )
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Enroll')
    }

    const maxCapacity = isOfferedCourseExist?.maxCapacity

    await OfferedCourseModel.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    })

    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Student Failed to Enroll')
  }
}

const updateEnrolledCourseMarks = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload

  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration)
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration Not Found')
  }
  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse)
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course Not Found')
  }
  const isStudentExist = await StudentModel.findById(student)
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found')
  }

  const faculty = await FacultyModel.findOne({ id: facultyId }, { _id: 1 })

  const isThisFacultyBelongToThisCourse = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty,
  })

  if (!isThisFacultyBelongToThisCourse) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are Forbidden !')
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isThisFacultyBelongToThisCourse.courseMarks

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5)

    const result = calculateGradeAndPoints(totalMarks)
    modifiedData.grade = result.grade
    modifiedData.gradePoint = result.gradePoints
    modifiedData.isCompleted = true
  }
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }
  const result = await EnrolledCourseModel.findByIdAndUpdate(
    isThisFacultyBelongToThisCourse._id,
    modifiedData,
    { new: true },
  )
  return result
}

export const enrolledCourseServices = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
}

import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { courseSearchableFields } from './course.constant'
import { TCourse, TCourseFaculty } from './course.interface'
import { CourseFacultyModel, CourseModel } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const createCourse = async (payload: TCourse) => {
  const result = await CourseModel.create(payload)
  return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await courseQuery.modelQuery
  const meta = await courseQuery.countTotal()
  return { meta, result }
}

const getSingleCourseFromDB = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
}
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const remainingDataUpdate = await CourseModel.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
      },
    )
    if (!remainingDataUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course ')
    }
    //check pre requisite courses
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //filter out deleted course fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course)
      const deletePreRequisitesCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true },
      )
      if (!deletePreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course ')
      }
      //filter out new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      )
      const newPreRequisitesCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        { new: true },
      )
      if (!newPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course ')
      }
    }
    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    )
    await session.commitTransaction()
    await session.endSession()

    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
  }
}
const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )

  return result
}
const assignFacultiesIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  )

  return result
}
const getFacultiesWithCourseFromDb = async (courseId: string) => {
  const result = await CourseFacultyModel.findOne({
    course: courseId,
  }).populate('faculties')
  console.log(result, 'course with faculty')
  return result
}
const removeFacultiesFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $pull: { faculties: { $in: payload } },
    },
    { new: true },
  )
  return result
}

export const CourseServices = {
  createCourse,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesIntoDB,
  getFacultiesWithCourseFromDb,
  removeFacultiesFromDB,
}

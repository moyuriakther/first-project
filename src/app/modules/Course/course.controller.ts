import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { CourseServices } from './course.service'
import sendResponse from '../../utils/sendResponse'

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourse(req.body)
  sendResponse(res, {
    success: true,
    message: 'Course is Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getAllCourses = catchAsync(async (req, res) => {
  //will call service function to send this data
  const result = await CourseServices.getAllCoursesFromDB(req.query)
  //send response
  sendResponse(res, {
    success: true,
    message: 'Courses Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
  })
})

const getSingleCourse = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await CourseServices.getSingleCourseFromDB(id)
  sendResponse(res, {
    success: true,
    message: 'Course Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await CourseServices.updateCourseIntoDB(id, req.body)
  sendResponse(res, {
    success: true,
    message: 'Updated Course Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

const deleteCourse = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await CourseServices.deleteCourseFromDB(id)
  sendResponse(res, {
    success: true,
    message: 'Course Data is deleted Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { courseId } = req.params
  const { faculties } = req.body
  const result = await CourseServices.assignFacultiesIntoDB(courseId, faculties)
  sendResponse(res, {
    success: true,
    message: 'Faculties Assign Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params
  console.log(courseId)
  //will call service function to send this data
  const result = await CourseServices.getFacultiesWithCourseFromDb(courseId)
  console.log(result, 'controller')
  sendResponse(res, {
    success: true,
    message: 'Faculties Get With Course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { courseId } = req.params
  const { faculties } = req.body
  const result = await CourseServices.removeFacultiesFromDB(courseId, faculties)
  sendResponse(res, {
    success: true,
    message: 'Faculties Remove Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  getFacultiesWithCourse,
  removeFacultiesFromCourse,
}

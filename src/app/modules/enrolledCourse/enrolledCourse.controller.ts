import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { enrolledCourseServices } from './enrolledCourse.service'

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const result = await enrolledCourseServices.createEnrolledCourse(
    userId,
    req.body,
  )
  //send response
  sendResponse(res, {
    success: true,
    message: 'Create Enrolled Course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const result = await enrolledCourseServices.updateEnrolledCourseMarks(
    req.user.userId,
    req.body,
  )
  //send response
  sendResponse(res, {
    success: true,
    message: 'Update Enrolled Course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const enrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
}

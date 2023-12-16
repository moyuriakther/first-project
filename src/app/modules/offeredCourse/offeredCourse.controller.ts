import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OfferedCourseServices } from './offeredCourse.service'

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body)
  sendResponse(res, {
    success: true,
    message: 'Offered Course is Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const getAllOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCourseFromDB(
    req.query,
  )
  sendResponse(res, {
    success: true,
    message: 'Get All Offered course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id)
  sendResponse(res, {
    success: true,
    message: 'Get Single Offered Course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  )
  sendResponse(res, {
    success: true,
    message: 'Updated Offered Course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id)
  sendResponse(res, {
    success: true,
    message: 'Offered Course Deleted Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
}

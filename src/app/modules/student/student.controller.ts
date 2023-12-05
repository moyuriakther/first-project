import httpStatus from 'http-status'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const getAllStudent = catchAsync(async (req, res) => {
  //will call service function to send this data
  const result = await StudentServices.getAllStudentInfoFromDB(req.query)
  //send response
  sendResponse(res, {
    success: true,
    message: 'Student Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getSingleStudent = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await StudentServices.getSingleStudentInfoFromDb(id)
  sendResponse(res, {
    success: true,
    message: 'Student Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params
  const { student } = req.body
  const result = await StudentServices.updateStudentIntoDB(id, student)
  sendResponse(res, {
    success: true,
    message: 'Updated Student Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

const deleteStudent = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await StudentServices.deleteStudentInfoFromDb(id)
  sendResponse(res, {
    success: true,
    message: 'Student Data deleted Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

export const StudentControllers = {
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
}

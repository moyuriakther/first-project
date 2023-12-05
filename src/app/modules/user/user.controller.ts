import httpStatus from 'http-status'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body
  const result = await UserServices.createStudentInfoDB(password, studentData)
  sendResponse(res, {
    success: true,
    message: 'Student Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body
  // console.log({ password }, { facultyData })
  const result = await UserServices.createFacultyIntoDB(password, facultyData)
  sendResponse(res, {
    success: true,
    message: 'Faculty Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
export const UserControllers = {
  createStudent,
  createFaculty,
}

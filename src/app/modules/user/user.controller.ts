import httpStatus from 'http-status'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
// import AppError from '../../errors/AppError';
// import { verifyToken } from '../auth/auth.utils';
// import config from '../../config';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body
  const result = await UserServices.createStudentInfoDB(
    req.file,
    password,
    studentData,
  )
  sendResponse(res, {
    success: true,
    message: 'Student Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body
  const result = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData,
  )
  sendResponse(res, {
    success: true,
    message: 'Faculty Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body
  console.log({ adminData, password })
  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  )
  sendResponse(res, {
    success: true,
    message: 'Admin Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await UserServices.changeStatus(id, req.body)
  sendResponse(res, {
    success: true,
    message: 'Status Changed Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user
  const result = await UserServices.getMe(userId, role)
  sendResponse(res, {
    success: true,
    message: 'Retrieved User Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  changeStatus,
  getMe,
}

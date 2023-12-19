import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthService } from './auth.service'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body)
  // console.log({ result })
  sendResponse(res, {
    success: true,
    message: 'Login Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword()
  // console.log({ result })
  sendResponse(res, {
    success: true,
    message: 'Change Password Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const AuthController = {
  loginUser,
  changePassword,
}

import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthService } from './auth.service'
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body)
  //set refresh token to cookie
  const {refreshToken, accessToken, needsPasswordChange} = result
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true
  })
  
  sendResponse(res, {
    success: true,
    message: 'Login Successfully',
    statusCode: httpStatus.OK,
    data: {accessToken, needsPasswordChange},
  })
})
const changePassword = catchAsync(async (req, res) => {
  const {...passwordData} = req.body
  const result = await AuthService.changePassword(req.user, passwordData)
  sendResponse(res, {
    success: true,
    message: 'Change Password Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const refreshToken = catchAsync(async (req, res) => {
  const {refreshToken} = req.cookies
  const result = await AuthService.refreshToken(refreshToken)
  sendResponse(res, {
    success: true,
    message: 'Refresh Token Generate Access Token Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id
  const result = await AuthService.forgetPassword(userId)
  sendResponse(res, {
    success: true,
    message: 'Reset Link is Generate Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  const result = await AuthService.resetPassword(req.body, token as string)
  sendResponse(res, {
    success: true,
    message: 'Reset Password Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword
}



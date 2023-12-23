import { z } from 'zod'
import { UserStatus } from '../user/user.constrant';

const userLoginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old Password is required' }),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
})
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
    
  }),
})
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User Id is required' }),
    
  }),
})
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User Id is required' }),
    newPassword: z.string({ required_error: 'New Password is required' }),
    
  }),
})

export const AuthValidation = {
  userLoginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
}

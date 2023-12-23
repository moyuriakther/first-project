import { z } from 'zod'
import { UserStatus } from './user.constrant';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .max(15, { message: 'Password can not be more then 15 character' }),
})

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),    
  }),
})

export const userValidation = {
  userValidationSchema,
  changeStatusValidationSchema
}

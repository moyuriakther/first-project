import { z } from 'zod'

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .max(15, { message: 'Password can not be more then 15 character' }),
})

export default userValidationSchema

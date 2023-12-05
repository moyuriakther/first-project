import { z } from 'zod'

// Define sub-schemas
const createNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim(),
})

// Define main schema
const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(15),
    admin: z.object({
      name: createNameValidationSchema,
      email: z.string().min(1).email(),
      gender: z.enum(['Male', 'Female', 'Other']),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      profileImg: z.string().optional(),
    }),
  }),
})

const updateNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim().optional(),
  middleName: z.string().max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim().optional(),
})

// Define main schema
const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: updateNameValidationSchema.optional(),
      email: z.string().min(1).email().optional(),
      gender: z.enum(['Male', 'Female', 'Other']).optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().min(1).optional(),
      emergencyContactNo: z.string().min(1).optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      profileImg: z.string().optional().optional(),
    }),
  }),
})

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
}

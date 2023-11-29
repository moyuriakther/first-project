import { z } from 'zod'

// Define sub-schemas
const nameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim(),
})

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1).trim(),
  fatherOccupation: z.string().min(1).trim(),
  fatherContactNo: z.string().min(1).trim(),
  motherName: z.string().min(1).trim(),
  motherOccupation: z.string().min(1).trim(),
  motherContactNo: z.string().min(1).trim(),
})

const localGuardianValidationSchema = z.object({
  name: z.string().min(1).trim(),
  occupation: z.string().min(1).trim(),
  contactNo: z.string().min(1).trim(),
  address: z.string().min(1).trim(),
})

// Define main schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(15),
    student: z.object({
      name: nameValidationSchema,
      email: z.string().min(1).email(),
      gender: z.enum(['Male', 'Female', 'Other']),
      dateOfBirth: z.string().optional(),
      contactNumber: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
})

// Export the Zod schema
export const studentValidations = { createStudentValidationSchema }

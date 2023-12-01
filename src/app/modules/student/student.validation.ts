import { z } from 'zod'

// Define sub-schemas
const createNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim(),
})

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).trim(),
  fatherOccupation: z.string().min(1).trim(),
  fatherContactNo: z.string().min(1).trim(),
  motherName: z.string().min(1).trim(),
  motherOccupation: z.string().min(1).trim(),
  motherContactNo: z.string().min(1).trim(),
})

const createLocalGuardianValidationSchema = z.object({
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
      name: createNameValidationSchema,
      email: z.string().min(1).email(),
      gender: z.enum(['Male', 'Female', 'Other']),
      dateOfBirth: z.string().optional(),
      contactNumber: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string().optional(),
      academicDepartment: z.string(),
    }),
  }),
})
//update validation schema
const updateNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim().optional(),
  middleName: z.string().max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim().optional(),
})

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).trim().optional(),
  fatherOccupation: z.string().min(1).trim().optional(),
  fatherContactNo: z.string().min(1).trim().optional(),
  motherName: z.string().min(1).trim().optional(),
  motherOccupation: z.string().min(1).trim().optional(),
  motherContactNo: z.string().min(1).trim().optional(),
})

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().min(1).trim().optional(),
  occupation: z.string().min(1).trim().optional(),
  contactNo: z.string().min(1).trim().optional(),
  address: z.string().min(1).trim().optional(),
})

// Define main schema
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      email: z.string().min(1).email().optional(),
      gender: z.enum(['Male', 'Female', 'Other']).optional(),
      dateOfBirth: z.string().optional(),
      contactNumber: z.string().min(1).optional(),
      emergencyContactNo: z.string().min(1).optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profileImg: z.string().optional().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
})

// Export the Zod schema
export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
}

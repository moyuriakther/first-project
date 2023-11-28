import { z } from 'zod'
import { Months } from './academicSemester.const'

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum(['Summer', 'Fall', 'Winter']),
    code: z.enum(['01', '02', '03']),
    year: z.string(),
    startMonth: z.enum([...Months] as [string, ...string[]]),
    endMonth: z.enum([...Months] as [string, ...string[]]),
  }),
})

export const academicSemesterValidation = {
  createAcademicSemesterValidationSchema,
}

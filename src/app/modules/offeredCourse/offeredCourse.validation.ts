import { z } from 'zod'
import { Days } from './offeredCourse.constant'

const timeStringValidateSchema = z.string().refine(
  (time) => {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    return regex.test(time)
  },
  { message: 'Invalid Time Format! Time should be in HH:mm Format' },
)

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidateSchema,
      endTime: timeStringValidateSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`)
        return end > start
      },
      { message: 'Start time Should be before end time!' },
    ),
})

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidateSchema,
      endTime: timeStringValidateSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`)
        return end > start
      },
      { message: 'Start time Should be before end time!' },
    ),
})

export const offeredCourseValidationSchema = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
}

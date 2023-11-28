import express from 'express'
import { academicSemesterControllers } from './academicSemester.controller'
import validateUserData from '../../middleware/validateRequest'
import { academicSemesterValidation } from './academicSemester.validation'

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateUserData(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
)

export const academicSemesterRoutes = router

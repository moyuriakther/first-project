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

router.get('/', academicSemesterControllers.getAllAcademicSemesters)
router.get(
  '/:semesterId',
  academicSemesterControllers.getSingleAcademicSemester,
)
router.patch(
  '/:semesterId',
  // validateUserData(
  //   academicSemesterValidation.updateAcademicSemesterValidationSchema,
  // ),
  academicSemesterControllers.findSemesterAndUpdateIntoDB,
)
export const academicSemesterRoutes = router

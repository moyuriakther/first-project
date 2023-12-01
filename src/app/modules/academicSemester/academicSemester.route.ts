import express from 'express'
import { academicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middleware/validateRequest'
import { academicSemesterValidation } from './academicSemester.validation'

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateRequest(
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
  // validateRequest(
  //   academicSemesterValidation.updateAcademicSemesterValidationSchema,
  // ),
  academicSemesterControllers.findSemesterAndUpdateIntoDB,
)
export const academicSemesterRoutes = router

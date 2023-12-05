import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { academicFacultyValidation } from './academicFaculty.validation'
import { academicFacultyControllers } from './academicFaculty.controller'

const router = express.Router()

router.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
)
router.get('/', academicFacultyControllers.getAllAcademicFaculty)
router.get('/:adminId', academicFacultyControllers.getSingleAcademicFaculty)
router.patch(
  '/:adminId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.updateAcademicFaculty,
)
export const academicFacultyRoutes = router

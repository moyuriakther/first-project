import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { academicFacultyValidation } from './academicFaculty.validation'
import { academicFacultyControllers } from './academicFaculty.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'

const router = express.Router()

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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

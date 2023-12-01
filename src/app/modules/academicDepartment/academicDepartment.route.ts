import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { academicDepartmentValidation } from './academicDepartment.validation'
import { academicDepartmentControllers } from './academicDepartment.controller'

const router = express.Router()

router.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.createAcademicDepartment,
)
router.get('/', academicDepartmentControllers.getAllAcademicDepartment)
router.get(
  '/:departmentId',
  academicDepartmentControllers.getSingleAcademicDepartment,
)
router.patch(
  '/:departmentId',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
)
export const academicDepartmentRoutes = router

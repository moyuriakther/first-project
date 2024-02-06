import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { academicDepartmentValidation } from './academicDepartment.validation'
import { academicDepartmentControllers } from './academicDepartment.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'

const router = express.Router()

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  // validateRequest(
  //   academicDepartmentValidation.createAcademicDepartmentValidationSchema,
  // ),
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

import express from 'express'
import { FacultyControllers } from './faculty.controller'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from './faculty.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'

const router = express.Router()

//will call controller function
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculty,
)
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  FacultyControllers.getSingleFaculty,
)
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
)
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  FacultyControllers.deleteFaculty,
)

export const FacultyRoutes = router

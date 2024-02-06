import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { SemesterRegistrationValidationSchema } from './semesterRegistration.validation'
import { SemesterRegistrationControllers } from './semesterRegistration.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'
const router = express.Router()

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidationSchema.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
)
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  SemesterRegistrationControllers.getAllSemesterRegistration,
)
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
)
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidationSchema.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
)
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationControllers.deleteSemesterRegistration,
)

export const SemesterRegistrationRoutes = router

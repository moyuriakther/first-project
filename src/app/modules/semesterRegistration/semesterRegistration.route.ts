import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { SemesterRegistrationValidationSchema } from './semesterRegistration.validation'
import { SemesterRegistrationControllers } from './semesterRegistration.controller'
const router = express.Router()

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidationSchema.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
)
router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration)
router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistration,
)
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidationSchema.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
)
router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSemesterRegistration,
)

export const SemesterRegistrationRoutes = router

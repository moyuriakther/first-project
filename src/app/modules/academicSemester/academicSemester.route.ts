import express from 'express'
import { academicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middleware/validateRequest'
import { academicSemesterValidation } from './academicSemester.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'

const router = express.Router()

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
)

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  academicSemesterControllers.getAllAcademicSemesters,
)
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

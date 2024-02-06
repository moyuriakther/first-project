import express from 'express'
import { OfferedCourseControllers } from './offeredCourse.controller'
import validateRequest from '../../middleware/validateRequest'
import { offeredCourseValidationSchema } from './offeredCourse.validation'
import { USER_ROLE } from '../user/user.constrant'
import auth from '../../middleware/auth'
const router = express.Router()

router.post(
  '/create-offered-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    offeredCourseValidationSchema.createOfferedCourseValidationSchema,
  ),
  OfferedCourseControllers.createOfferedCourse,
)
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getAllOfferedCourse,
)
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getSingleOfferedCourse,
)
router.patch(
  '/:id',
  validateRequest(
    offeredCourseValidationSchema.updateOfferedCourseValidationSchema,
  ),
  OfferedCourseControllers.updateOfferedCourse,
)
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse)

export const OfferedCourseRoutes = router

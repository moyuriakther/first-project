import express from 'express'
import { enrolledCourseControllers } from './enrolledCourse.controller'
import validateRequest from '../../middleware/validateRequest'
import { enrolledCourseValidations } from './enrolledCourse.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'

const router = express.Router()

//will call controller function
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    enrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  enrolledCourseControllers.createEnrolledCourse,
)

router.patch(
  '/update-enrolled-course',
  auth(USER_ROLE.faculty, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    enrolledCourseValidations.updateEnrolledCourseMarksValidationSchema,
  ),
  enrolledCourseControllers.updateEnrolledCourseMarks,
)

export const EnrolledCourseRoutes = router

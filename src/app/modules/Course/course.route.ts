import express from 'express'
import { CourseControllers } from './course.controller'
import validateRequest from '../../middleware/validateRequest'
import { courseValidations } from './course.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constrant'

const router = express.Router()

//will call controller function
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
)
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
  ),
  CourseControllers.getAllCourses,
)
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
  ),
  CourseControllers.getSingleCourse,
)
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
)
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  CourseControllers.deleteCourse,
)
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
)
router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getFacultiesWithCourse,
)
router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
)

export const CourseRoutes = router

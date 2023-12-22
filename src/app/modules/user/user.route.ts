import express from 'express'
import { UserControllers } from './user.controller'
import { studentValidations } from '../student/student.validation'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from '../faculty/faculty.validation'
import { adminValidations } from '../admin/admin.validation'
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constrant';

const router = express.Router()

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
)
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
)
router.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
)

export const UserRoutes = router

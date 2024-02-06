import express, { NextFunction, Request, Response } from 'express'
import { UserControllers } from './user.controller'
import { studentValidations } from '../student/student.validation'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from '../faculty/faculty.validation'
import { adminValidations } from '../admin/admin.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from './user.constrant'
import { userValidation } from './user.validation'
import { upload } from '../../utils/sendImgToCloudinary'

const router = express.Router()

router.post(
  '/create-student',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
)
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
)
router.post(
  '/create-admin',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
)
router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
)
router.get(
  '/me',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
    USER_ROLE.superAdmin,
  ),
  UserControllers.getMe,
)

export const UserRoutes = router

import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middleware/validateRequest'
import { studentValidations } from './student.validation'
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constrant';

const router = express.Router()

//will call controller function
router.get('/', auth(USER_ROLE.admin, USER_ROLE.faculty), StudentControllers.getAllStudent)
router.get('/:id',auth(USER_ROLE.admin, USER_ROLE.faculty), StudentControllers.getSingleStudent)
router.patch(
  '/:id',auth(USER_ROLE.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
)
router.delete('/:id',auth(USER_ROLE.admin), StudentControllers.deleteStudent)

export const StudentRoutes = router

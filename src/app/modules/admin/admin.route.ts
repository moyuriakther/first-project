import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'
import { USER_ROLE } from '../user/user.constrant'
import auth from '../../middleware/auth'

const router = express.Router()

//will call controller function
router.get('/', auth(USER_ROLE.superAdmin), AdminControllers.getAllAdmin)
router.get('/:id', auth(USER_ROLE.superAdmin), AdminControllers.getSingleAdmin)
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
)
router.delete('/:id', auth(USER_ROLE.superAdmin), AdminControllers.deleteAdmin)

export const AdminRoutes = router

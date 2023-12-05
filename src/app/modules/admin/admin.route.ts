import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'

const router = express.Router()

//will call controller function
router.get('/', AdminControllers.getAllAdmin)
router.get('/:id', AdminControllers.getSingleAdmin)
router.patch(
  '/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
)
router.delete('/:id', AdminControllers.deleteAdmin)

export const AdminRoutes = router

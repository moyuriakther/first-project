import express from 'express'
import { FacultyControllers } from './faculty.controller'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from './faculty.validation'

const router = express.Router()

//will call controller function
router.get('/', FacultyControllers.getAllFaculty)
router.get('/:id', FacultyControllers.getSingleFaculty)
router.patch(
  '/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
)
router.delete('/:id', FacultyControllers.deleteFaculty)

export const FacultyRoutes = router

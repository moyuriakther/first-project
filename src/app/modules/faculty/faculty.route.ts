import express from 'express'
import { FacultyControllers } from './faculty.controller'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from './faculty.validation'

const router = express.Router()

//will call controller function
router.get('/', FacultyControllers.getAllFaculty)
router.get('/:facultyId', FacultyControllers.getSingleFaculty)
router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
)
router.delete('/:facultyId', FacultyControllers.deleteFaculty)

export const FacultyRoutes = router

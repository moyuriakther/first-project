import express from 'express'
import { OfferedCourseControllers } from './offeredCourse.controller'
import validateRequest from '../../middleware/validateRequest'
import { offeredCourseValidationSchema } from './offeredCourse.validation'
const router = express.Router()

router.post(
  '/create-offered-course',
  validateRequest(
    offeredCourseValidationSchema.createOfferedCourseValidationSchema,
  ),
  OfferedCourseControllers.createOfferedCourse,
)
router.get('/', OfferedCourseControllers.getAllOfferedCourse)
router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse)
router.patch(
  '/:id',
  validateRequest(
    offeredCourseValidationSchema.updateOfferedCourseValidationSchema,
  ),
  OfferedCourseControllers.updateOfferedCourse,
)
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse)

export const OfferedCourseRoutes = router

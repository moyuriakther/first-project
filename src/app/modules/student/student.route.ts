import express from 'express'
import { StudentControllers } from './student.controller'
// import { StudentControllers } from './student.controller.joi'

const router = express.Router()

//will call controller function
router.get('/', StudentControllers.getAllStudent)
router.get('/:id', StudentControllers.getSingleStudent)
router.delete('/:id', StudentControllers.deleteStudent)

export const StudentRoutes = router

import express from 'express'
import { StudentControllers } from './student.controller'
// import { StudentControllers } from './student.controller.joi'

const router = express.Router()

//will call controller function
router.post('/create-student', StudentControllers.createStudent)
router.get('/', StudentControllers.getAllStudent)
router.get('/:id', StudentControllers.getSingleStudent)

export const StudentRoutes = router

import { Request, Response } from 'express'
import { StudentServices } from './student.service'

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body
    //will call service function to send this data
    const result = await StudentServices.createStudentInfoDB(studentData)
    res.status(200).json({
      success: true,
      message: 'Student Created Successfully',
      data: result,
    })
    //send response
  } catch (error) {
    console.log(error)
  }
}
const getAllStudent = async (req: Request, res: Response) => {
  try {
    //will call service function to send this data
    const result = await StudentServices.getAllStudentInfoFromDB()
    res.status(200).json({
      success: true,
      message: 'Student Data Retrieved Successfully',
      data: result,
    })
    //send response
  } catch (error) {
    console.log(error)
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    //will call service function to send this data
    const id = req.params.id
    const result = await StudentServices.getSingleStudentInfoFromDb(id)
    res.status(200).json({
      success: true,
      message: 'Student Data Retrieved Successfully',
      data: result,
    })
    //send response
  } catch (error) {
    console.log(error)
  }
}

export const StudentControllers = {
  createStudent,
  getAllStudent,
  getSingleStudent,
}

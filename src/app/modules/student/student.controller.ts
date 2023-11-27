import httpStatus from 'http-status'
import { RequestHandler } from 'express'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'

const getAllStudent: RequestHandler = async (req, res, next) => {
  try {
    //will call service function to send this data
    const result = await StudentServices.getAllStudentInfoFromDB()
    //send response
    sendResponse(res, {
      success: true,
      message: 'Student Data Retrieved Successfully',
      statusCode: httpStatus.OK,
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    //will call service function to send this data
    const id = req.params.id
    const result = await StudentServices.getSingleStudentInfoFromDb(id)
    sendResponse(res, {
      success: true,
      message: 'Student Data Retrieved Successfully',
      statusCode: httpStatus.OK,
      data: result,
    })
    //send response
  } catch (err) {
    next(err)
  }
}

const deleteStudent: RequestHandler = async (req, res, next) => {
  try {
    //will call service function to send this data
    const id = req.params.id
    const result = await StudentServices.deleteStudentInfoFromDb(id)
    sendResponse(res, {
      success: true,
      message: 'Student Data deleted Successfully',
      statusCode: httpStatus.OK,
      data: result,
    })
    //send response
  } catch (err) {
    next(err)
  }
}

export const StudentControllers = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
}

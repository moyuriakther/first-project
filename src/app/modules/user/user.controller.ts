import httpStatus from 'http-status'

import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: studentData } = req.body
    //validate data using zod
    // const zodParsedData = studentValidationSchema.parse(studentData)
    const result = await UserServices.createStudentInfoDB(password, studentData)

    sendResponse(res, {
      success: true,
      message: 'Student Created Successfully',
      statusCode: httpStatus.OK,
      data: result,
    })
    //send response
  } catch (err) {
    next(err)
  }
}
export const UserControllers = {
  createStudent,
}

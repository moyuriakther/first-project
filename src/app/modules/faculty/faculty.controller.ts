import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
import { FacultyServices } from './faculty.service'

const getAllFaculty = catchAsync(async (req, res) => {
  //will call service function to send this data
  const result = await FacultyServices.getAllFacultyInfoFromDB(req.query)
  //send response
  sendResponse(res, {
    success: true,
    message: 'Faculty Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getSingleFaculty = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await FacultyServices.getSingleFacultyInfoFromDb(id)
  sendResponse(res, {
    success: true,
    message: 'Faculty Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const { faculty } = req.body
  const result = await FacultyServices.updateFacultyIntoDB(id, faculty)
  sendResponse(res, {
    success: true,
    message: 'Updated Faculty Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

const deleteFaculty = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await FacultyServices.deleteFacultyInfoFromDb(id)
  sendResponse(res, {
    success: true,
    message: 'Faculty Data deleted Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
}

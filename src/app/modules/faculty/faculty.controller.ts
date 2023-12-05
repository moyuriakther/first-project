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
  const { facultyId } = req.params
  const result = await FacultyServices.getSingleFacultyInfoFromDb(facultyId)
  sendResponse(res, {
    success: true,
    message: 'Faculty Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const { faculty } = req.body
  const result = await FacultyServices.updateFacultyIntoDB(facultyId, faculty)
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
  const { facultyId } = req.params
  const result = await FacultyServices.deleteFacultyInfoFromDb(facultyId)
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

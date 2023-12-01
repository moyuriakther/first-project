import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { academicFacultyServices } from './academicFaculty.service'

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  )
  sendResponse(res, {
    success: true,
    message: 'Academic Faculty is Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getAllAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.getAllAcademicFacultiesFromDB()
  sendResponse(res, {
    success: true,
    message: 'Get All Academic Faculty Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.getSingleAcademicFacultiesFromDB(
    req.params.facultyId,
  )
  sendResponse(res, {
    success: true,
    message: 'Get Single Academic Faculty Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const result =
    await academicFacultyServices.updateSingleAcademicFacultyIntoDB(
      req.params.facultyId,
      req.body,
    )
  sendResponse(res, {
    success: true,
    message: 'Update Academic Faculty data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
}

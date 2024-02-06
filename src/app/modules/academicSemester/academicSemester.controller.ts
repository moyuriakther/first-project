import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { academicSemesterServices } from './academicSemester.service'

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  )
  sendResponse(res, {
    success: true,
    message: 'Academic Semester is Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemestersFromDB(
    req.query,
  )
  sendResponse(res, {
    success: true,
    message: 'Get All Academic Semester Successfully',
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
  })
})

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params
  const result =
    await academicSemesterServices.getSingleAcademicSemesterFromDB(semesterId)
  sendResponse(res, {
    success: true,
    message: 'Single Academic Semester Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const findSemesterAndUpdateIntoDB = catchAsync(async (req, res) => {
  const { semesterId } = req.params
  const result = await academicSemesterServices.findAcademicSemesterAndUpdate(
    semesterId,
    req.body,
  )

  sendResponse(res, {
    success: true,
    message: 'Update Academic Semester Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  findSemesterAndUpdateIntoDB,
}

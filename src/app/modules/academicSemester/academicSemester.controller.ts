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
    message: 'Academic Semester is Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const academicSemesterControllers = {
  createAcademicSemester,
}

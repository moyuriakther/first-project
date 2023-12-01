import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { academicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDB(req.body)
  sendResponse(res, {
    success: true,
    message: 'Academic Department is Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentsFromDB()
  sendResponse(res, {
    success: true,
    message: 'Get All Academic Department Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDB(
      req.params.departmentId,
    )
  sendResponse(res, {
    success: true,
    message: 'Get Single Academic Department Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.updateSingleAcademicDepartmentIntoDB(
      req.params.departmentId,
      req.body,
    )
  sendResponse(res, {
    success: true,
    message: 'Update Academic Department data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
}

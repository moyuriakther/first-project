import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SemesterRegistrationServices } from './semesterRegistration.service'

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    )
  sendResponse(res, {
    success: true,
    message: 'Semester Registration is Created Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
      req.query,
    )
  sendResponse(res, {
    success: true,
    message: 'Get All Semester Registration Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id)
  sendResponse(res, {
    success: true,
    message: 'Get Semester Registration By Id Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    )
  sendResponse(res, {
    success: true,
    message: 'Update Semester Registration Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params
  const result =
    await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id)
  sendResponse(res, {
    success: true,
    message: 'Deleted Semester Registration Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
}

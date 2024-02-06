import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
import { AdminServices } from './admin.service'

const getAllAdmin = catchAsync(async (req, res) => {
  //will call service function to send this data
  const result = await AdminServices.getAllAdminInfoFromDB(req.query)
  //send response
  sendResponse(res, {
    success: true,
    message: 'Admin Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
  })
})

const getSingleAdmin = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await AdminServices.getSingleAdminInfoFromDb(id)
  sendResponse(res, {
    success: true,
    message: 'Admin Data Retrieved Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})
const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const { admin } = req.body
  const result = await AdminServices.updateAdminIntoDB(id, admin)
  sendResponse(res, {
    success: true,
    message: 'Updated Admin Data Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

const deleteAdmin = catchAsync(async (req, res) => {
  //will call service function to send this data
  const { id } = req.params
  const result = await AdminServices.deleteAdminInfoFromDb(id)
  sendResponse(res, {
    success: true,
    message: 'Admin Data deleted Successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
  //send response
})

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
}

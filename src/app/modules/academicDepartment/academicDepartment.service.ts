import QueryBuilder from '../../builder/QueryBuilder'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartmentModel } from './academicDepartment.model'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const newFaculty = await AcademicDepartmentModel.create(payload)
  return newFaculty
}

const getAllAcademicDepartmentsFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartmentModel.find().populate('academicFaculty'),
    query,
  )
  const result = await academicDepartmentQuery.modelQuery
  const meta = await academicDepartmentQuery.countTotal()

  return { meta, result }
}
const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
  const result =
    await AcademicDepartmentModel.findById(departmentId).populate(
      'academicFaculty',
    )
  return result
}
const updateSingleAcademicDepartmentIntoDB = async (
  departmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartmentModel.findOneAndUpdate(
    { _id: departmentId },
    payload,
    { new: true },
  )
  return result
}

export const academicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateSingleAcademicDepartmentIntoDB,
}

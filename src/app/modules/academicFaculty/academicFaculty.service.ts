import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicFacultyModel } from './academicFaculty.model'

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const newFaculty = await AcademicFacultyModel.create(payload)
  return newFaculty
}

const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFacultyModel.find()
  return result
}
const getSingleAcademicFacultiesFromDB = async (facultyId: string) => {
  const result = await AcademicFacultyModel.findById(facultyId)
  return result
}
const updateSingleAcademicFacultyIntoDB = async (
  facultyId: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFacultyModel.findOneAndUpdate(
    { _id: facultyId },
    payload,
    { new: true },
  )
  return result
}

export const academicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultiesFromDB,
  updateSingleAcademicFacultyIntoDB,
}

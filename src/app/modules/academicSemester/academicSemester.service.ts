import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterModel } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  const newSemester = await AcademicSemesterModel.create(payload)
  return newSemester
}

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
}

import { academicSemesterNameCodeMapper } from './academicSemester.const'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterModel } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //semester name --> semester code
  //academicSemesterNameCodeMapper['Fall']  !== 03 then throw error,     here ['Fall' = 03]
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code')
  }
  const newSemester = await AcademicSemesterModel.create(payload)
  return newSemester
}

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemesterModel.find()
  return result
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id)
  return result
}

const findAcademicSemesterAndUpdate = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  console.log({ payload }, { id })
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semester code')
  }

  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  )
  console.log({ result })
  return result
}

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  findAcademicSemesterAndUpdate,
}

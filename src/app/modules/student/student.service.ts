import { Student } from './student.interface'
import { StudentModel } from './student.model'

const createStudentInfoDB = async (student: Student) => {
  const result = await StudentModel.create(student)
  return result
}

const getAllStudentInfoFromDB = async () => {
  const result = await StudentModel.find()
  return result
}

const getSingleStudentInfoFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id: id })
  return result
}

export const StudentServices = {
  createStudentInfoDB,
  getAllStudentInfoFromDB,
  getSingleStudentInfoFromDb,
}

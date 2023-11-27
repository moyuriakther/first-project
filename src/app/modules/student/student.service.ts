import { StudentModel } from './student.model'

const getAllStudentInfoFromDB = async () => {
  const result = await StudentModel.find()
  return result
}

const getSingleStudentInfoFromDb = async (id: string) => {
  // const result = await StudentModel.findOne({ id: id })
  const result = await StudentModel.aggregate([{ $match: { id: id } }])
  return result
}

const deleteStudentInfoFromDb = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true })
  return result
}

export const StudentServices = {
  getAllStudentInfoFromDB,
  getSingleStudentInfoFromDb,
  deleteStudentInfoFromDb,
}

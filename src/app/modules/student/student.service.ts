import { TStudent } from './student.interface'
import { StudentModel } from './student.model'

const createStudentInfoDB = async (studentData: TStudent) => {
  //static method start
  // first check user is exist
  if (await StudentModel.isUserExist(studentData.id)) {
    throw new Error('User already exist')
  }
  const result = await StudentModel.create(studentData) // built in static method
  //static method end

  //instance method start
  // const student = new StudentModel(studentData) // create an instance
  // const result = (await student.isUserExist(studentData.id))
  //   ? Promise.reject(new Error('User already exists'))
  //   : student.save() // built in instance method
  //instance method end

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

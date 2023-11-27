import config from '../../config'
import { TStudent } from '../student/student.interface'
import { StudentModel } from '../student/student.model'
import { TUser } from './user.interface'
import { UserModel } from './user.model'

const createStudentInfoDB = async (password: string, studentData: TStudent) => {
  const userData: Partial<TUser> = {}
  // if password not given use default password
  userData.password = password || (config.default_pass as string)
  userData.role = 'student' //set student role
  userData.id = '203010001' //set manually generated id
  //create a user
  const newUser = await UserModel.create(userData) // built in static method
  // create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user to student data
    studentData.id = newUser.id
    studentData.user = newUser._id //reference id
    const newStudent = await StudentModel.create(studentData)
    return newStudent
  }
}
export const UserServices = {
  createStudentInfoDB,
}

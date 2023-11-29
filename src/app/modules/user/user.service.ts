import config from '../../config'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { StudentModel } from '../student/student.model'
import { TUser } from './user.interface'
import { UserModel } from './user.model'
import { generateStudentId } from './user.utils'

const createStudentInfoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {}
  // if password not given use default password
  userData.password = password || (config.default_pass as string)
  userData.role = 'student' //set student role

  // first academic semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  )

  if (!admissionSemester) {
    throw new Error('Admission semester not found')
  }

  userData.id = await generateStudentId(admissionSemester) //set generated id
  //create a user
  const newUser = await UserModel.create(userData) // built in static method
  // create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user to student data
    payload.id = newUser.id
    payload.user = newUser._id //reference id
    const newStudent = await StudentModel.create(payload)
    return newStudent
  }
}
export const UserServices = {
  createStudentInfoDB,
}

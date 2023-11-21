import { Model } from 'mongoose'

export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}
export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}
export type TLocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
}
//main interface
export type TStudent = {
  id: string
  password: string
  name: TUserName
  email: string
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  contactNumber: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  guardian: TGuardian
  localGuardian: TLocalGuardian
  profileImg?: string
  isActive: 'active' | 'blocked'
}

//creating instance
// export type TStudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>
// }
// export type TStudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   TStudentMethods
// >

//for creating static
export interface TStudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>
}

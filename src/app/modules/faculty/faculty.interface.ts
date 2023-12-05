import { Model, Types } from 'mongoose'
export type TFacultyName = {
  firstName: string
  middleName?: string
  lastName: string
}
//main interface
export type TFaculty = {
  id: string
  user: Types.ObjectId
  designation: string
  name: TFacultyName
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  academicDepartment: Types.ObjectId
  isDeleted: boolean
}

//for creating static
export interface TFacultyModel extends Model<TFaculty> {
  isUserExist(id: string): Promise<TFaculty | null>
}

import { Model, Types } from 'mongoose'
export type TAdminName = {
  firstName: string
  middleName?: string
  lastName: string
}
//main interface
export type TAdmin = {
  id: string
  user: Types.ObjectId
  designation: string
  name: TAdminName
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  isDeleted: boolean
}

//for creating static
export interface TAdminModel extends Model<TAdmin> {
  isUserExist(id: string): Promise<TAdmin | null>
}

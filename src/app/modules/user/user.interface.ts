/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'
import { USER_ROLE } from './user.constrant'

export interface TUser {
  id: string
  email: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'student' | 'faculty' | 'admin'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export interface IUserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>
  isPasswordMatched(plainTextPass: string, hashPass: string): Promise<boolean>
  isUserDeleted(user: TUser): Promise<boolean>
  isUserBlocked(user: TUser): Promise<boolean>
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE

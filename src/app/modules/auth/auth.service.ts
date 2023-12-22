import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { UserModel } from '../user/user.model'
import { TUserLogin } from './auth.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import bcrypt from 'bcrypt'
import { createToken } from './auth.utils';

const loginUser = async (payload: TUserLogin) => {
  const user = await UserModel.isUserExistByCustomId(payload?.id)
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not found')
  }

  if (await UserModel.isUserDeleted(user)) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is Deleted')
  }

  if (await UserModel.isUserBlocked(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked')
  }
  //check password is correct
  if (!(await UserModel.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password Not Matched')
  }
  
  const jwtPayload = { userId: user.id, role: user.role }

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string)
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string)

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  }
}

const changePassword = async (userData:JwtPayload, payload:{ oldPassword: string, newPassword: string}) => {
  
  const user = await UserModel.isUserExistByCustomId(userData?.userId)
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not found')
  }

  if (await UserModel.isUserDeleted(user)) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is Deleted')
  }

  if (await UserModel.isUserBlocked(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked')
  }
  //check password is correct
  if (!(await UserModel.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password Not Matched')
  }
const newPasswordHash = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round))
await UserModel.findOneAndUpdate({id: userData?.userId, role: userData?.role},{password:newPasswordHash, needsPasswordChange: false,   passwordChangedAt: new Date(),} )
return null
}
const refreshToken = async (token: string) => {
  
 // checking if the given token is valid
 const decoded = jwt.verify(
  token,
  config.jwt_refresh_secret as string,
) as JwtPayload;

const { userId, iat } = decoded;

// checking if the user is exist
const user = await UserModel.isUserExistByCustomId(userId);

if (!user) {
  throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
}
// checking if the user is already deleted

const isDeleted = user?.isDeleted;

if (isDeleted) {
  throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
}

// checking if the user is blocked
const userStatus = user?.status;

if (userStatus === 'blocked') {
  throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
}

if (
  user.passwordChangedAt &&
  UserModel.isJWTIssuedBeforePasswordChanged(
    user.passwordChangedAt,
    iat as number,
  )
) {
  throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
}

const jwtPayload = { userId: user.id, role: user.role }

const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string)

return {accessToken}
}

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken
}

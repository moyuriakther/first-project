import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { UserModel } from '../user/user.model'
import { TUserLogin } from './auth.interface'
import jwt from 'jsonwebtoken'
import config from '../../config'

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
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  })

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  }
}

const changePassword = async () => {}

export const AuthService = {
  loginUser,
  changePassword,
}

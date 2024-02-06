import { Schema, model } from 'mongoose'
import { IUserModel, TUser } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser, IUserModel>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'faculty', 'admin', 'superAdmin'],
        message: '{VALUES} is not valid',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'blocked'],
        message: '{VALUES} is not valid',
      },
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

//pre middleware and document middleware
userSchema.pre('save', async function (next) {
  //hashing password and save to DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  )
  next()
})
//post middleware and document middleware
userSchema.post('save', async function (doc, next) {
  doc.password = ''
  next()
})

// create static
userSchema.statics.isUserExistByCustomId = async function (id) {
  return await UserModel.findOne({ id }).select('+password')
}
userSchema.statics.isUserDeleted = async function (user) {
  return await user?.isDeleted
}
userSchema.statics.isUserBlocked = async function (user) {
  return (await user?.status) === 'blocked'
}
userSchema.statics.isPasswordMatched = async function (
  plainTextPass,
  hashPass,
) {
  return await bcrypt.compare(plainTextPass, hashPass)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000
  console.log(passwordChangedTime > jwtIssuedTimestamp)
  return passwordChangedTime > jwtIssuedTimestamp
}

export const UserModel = model<TUser, IUserModel>('User', userSchema)

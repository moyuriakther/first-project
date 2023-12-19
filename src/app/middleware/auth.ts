/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check token sent from client
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized')
    }

    // Check if the token is verified
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized')
        }

        if (decoded) {
          // Use type assertion to inform TypeScript about the 'user' property
          ;(req as any).user = decoded as JwtPayload
        }
        next()
      },
    )
  })
}

export default auth

// import { NextFunction, Request, Response } from 'express'
// import catchAsync from '../utils/catchAsync'
// import AppError from '../errors/AppError'
// import httpStatus from 'http-status'
// import jwt, { JwtPayload } from 'jsonwebtoken'
// import config from '../config'
// import { TUserRole } from '../modules/user/user.interface'

// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     //check token send from client
//     const token = req.headers.authorization

//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized')
//     }
//     // check token is verify
//     jwt.verify(
//       token,
//       config.jwt_access_secret as string,
//       function (err, decoded) {
//         if (err) {
//           throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized')
//         }
//         // console.log((req = decoded as JwtPayload), 'auth')
//         console.log(decoded)
//         // req.user = decoded as JwtPayload
//         if (decoded) {
//           req.user = decoded as JwtPayload // Assign within the if block
//         }

//         next()
//       },
//     )
//   })
// }
// export default auth

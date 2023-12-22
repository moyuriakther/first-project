import  jwt  from 'jsonwebtoken';

export const createToken = (jwtPayload: Record<string, unknown>, secret: string, expiresIn: string) => jwt.sign(jwtPayload, secret, {
     expiresIn,
  })
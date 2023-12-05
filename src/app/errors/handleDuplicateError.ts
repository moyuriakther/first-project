/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/error'

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err?.message?.match(/"([^"]*)"/)
  const errMessage = match && match[1]
  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${errMessage} is already exist`,
    },
  ]
  const statusCode = 404
  return {
    statusCode,
    message: 'Invalid id ',
    errorSources,
  }
}
export default handleDuplicateError

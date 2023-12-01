//use for send error message with error code whice we cant send only useing Error
class AppError extends Error {
  public statusCode: number
  constructor(statusCode: number, message: string, stack = '') {
    super(message)
    this.statusCode = statusCode

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
export default AppError

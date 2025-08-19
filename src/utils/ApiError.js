class ApiError extends Error {
  constructor(
    message = "Somthing went wrong!",
    statusCode= "500",
    errors = [],
    stack = ""
    
) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.massage = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

  }
}
export {ApiError};
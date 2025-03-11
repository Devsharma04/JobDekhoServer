//custom error

class customError extends Error {
  constructor(statuscode, message) {
    super(message);
    this.statuscode = statuscode;
  }
}

export default customError;

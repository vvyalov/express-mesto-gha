class RequestError extends Error {
  constructor(data) {
    super(data);
    this.statusCode = 400;
  }
}

module.exports = RequestError;

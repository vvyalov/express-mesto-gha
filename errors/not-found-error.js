class NotFoundError extends Error {
  constructor(data) {
    super(data);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

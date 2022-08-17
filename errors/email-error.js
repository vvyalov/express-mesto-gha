class EmailError extends Error {
  constructor(data) {
    super(data);
    this.statusCode = 409;
  }
}

module.exports = EmailError;

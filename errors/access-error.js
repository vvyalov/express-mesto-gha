class AccessError extends Error {
  constructor(data) {
    super(data);
    this.statusCode = 401;
  }
}

module.exports = AccessError;

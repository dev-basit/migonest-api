class Response {
  constructor(data = null, statusCode = null, message = null, status = null) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.status = status;
  }

  setMessage(message) {
    this.message = message;
  }

  getMessage() {
    return this.message;
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setStatusCode(statusCode) {
    this.statusCode = statusCode;
  }

  getStatusCode() {
    return this.statusCode;
  }
}

exports.Response = Response;

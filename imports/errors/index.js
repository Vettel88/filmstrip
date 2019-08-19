class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.message = message
  }
}
class PermissionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PermissionError'
    this.message = message
  }
}
class DatabaseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DatabaseError'
    this.message = message
  }
  static CreateFailed = () => { return new DatabaseError('CreateFailed') }
  static ReadFailed = () => { return new DatabaseError('ReadFailed') }
  static UpdateFailed = () => { return new DatabaseError('UpdateFailed') }
  static DeleteFailed = () => { return new DatabaseError('DeleteFailed') }
}

export {
  ValidationError,
  PermissionError,
  DatabaseError
}
import { SecupayApiError } from './schema'

export class SecupayError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public apiError?: SecupayApiError,
  ) {
    super(message)
    this.name = 'SecupayError'
  }
}

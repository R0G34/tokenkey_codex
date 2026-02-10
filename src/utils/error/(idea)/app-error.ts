export class AppError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = 'AppError'
    if (cause instanceof Error) {
      this.stack = cause.stack // Preserve original stack
    }
  }
}

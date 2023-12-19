import { HttpException } from '@nestjs/common'

export default abstract class BaseError extends HttpException {}

/// Keep adding other exceptions

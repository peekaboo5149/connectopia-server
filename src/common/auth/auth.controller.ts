import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { Public } from './auth.decorator'
import { AuthService } from './auth.service'
import { AuthenticateUserParams, CreateUserParams } from './models/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  ////
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  public async login(
    @Res() response: Response,
    @Body() requestBody: AuthenticateUserParams,
  ) {
    const token = await this.authService.loginUser(requestBody)
    response.status(201).json({
      token,
    })
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(
    @Res() response: Response,
    @Body() requestBody: CreateUserParams,
  ) {
    const userResponse = await this.authService.addUser(requestBody)
    response.status(201).json({
      message: 'User created successfully',
      user: userResponse,
    })
  }
}

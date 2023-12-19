import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { AuthenticateUserParams, CreateUserParams } from './models/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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

  @Post('register')
  public async register(
    @Res() response: Response,
    @Body() requestBody: CreateUserParams,
  ) {
    const userResponse = await this.authService.createUser(requestBody)
    response.status(201).json({
      message: 'User created successfully',
      user: userResponse,
    })
  }
}

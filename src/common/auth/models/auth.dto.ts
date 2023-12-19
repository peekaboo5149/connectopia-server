import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserParams {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  readonly username: string

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string
}

export class AuthenticateUserParams {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  readonly username: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string
}

export class UserDto {
  constructor(
    public id: string,
    public username: string,
    public email: string,
  ) {}
}

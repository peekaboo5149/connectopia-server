import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EncoderService } from 'src/common/encoder/encoder.service'
import {
  AuthenticateUserParams,
  CreateUserParams,
  UserDto,
} from './models/auth.dto'
import { Payload } from './models/types'
import { UserRepository } from './user/user.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: EncoderService,
    private readonly jwtService: JwtService,
  ) {}

  /// Use to create a user
  async addUser(params: CreateUserParams) {
    const { username, password, email } = params

    // find if user exist
    const existingUser = await this.userRepository.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      throw new ConflictException('User already exist')
    }

    // Encode the password
    const hashPassword = await this.encoder.encode(password)

    const user = await this.userRepository.create({
      username,
      password: hashPassword,
      email,
    })

    return new UserDto(user._id, user.username, user.email)
  }

  /// Use to login a user
  async loginUser(params: AuthenticateUserParams) {
    const { username, password } = params

    const user = await this.userRepository.findOne({ username })
    if (
      !user ||
      !(
        user &&
        (await this.encoder.compare({
          hash: user.password,
          original: password,
        }))
      )
    ) {
      throw new UnauthorizedException('Invalid Username/Password')
    }

    const payload: Payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    }

    // return a jwt token here
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}

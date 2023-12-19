import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { EncoderService } from 'src/common/encoder/encoder.service'
import {
  AuthenticateUserParams,
  CreateUserParams,
  UserDto,
} from './models/auth.dto'
import { UserRepository } from './user/user.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: EncoderService,
  ) {}

  async createUser(params: CreateUserParams) {
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

    // return a jwt token here
    return 'success'
  }
}

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserRepository } from './user.repository'
import { User, UserSchema } from './user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}

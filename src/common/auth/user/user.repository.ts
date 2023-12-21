import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EntityRepository } from 'src/shared/database/entity.repository'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserRepository extends EntityRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel)
  }

  public async validateUsers(ids: string[]): Promise<boolean> {
    const users = await this.userModel.find({ _id: { $in: ids } })
    return ids.length === users.length
  }
}

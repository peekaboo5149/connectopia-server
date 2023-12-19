import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    showId?: boolean,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(filterQuery, {
        __v: 0,
        ...projection,
      })
      .exec()
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T[] | null> {
    return this.entityModel
      .find(filterQuery, {
        __v: 0,
        ...projection,
      })
      .exec()
  }

  async create(entityData: unknown) {
    return new this.entityModel(entityData).save()
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(filterQuery, updateEntityData, {
      new: true,
    })
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    return (await this.entityModel.deleteMany(filterQuery)).deletedCount >= 1
  }
}

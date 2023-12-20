import { ArrayUnique, IsArray, IsOptional, IsString } from 'class-validator'

export class CreateRoomDto {
  @IsString({ message: 'Name must be a string' })
  readonly name: string

  @IsString({ message: 'Description must be a string' })
  @IsOptional({ message: 'Description is optional' })
  readonly description?: string

  @IsOptional({ message: 'Members is optional' })
  @IsArray({ message: 'Members must be an array' })
  @ArrayUnique({ message: 'Members array must contain unique user IDs' })
  readonly members?: string[] // User ids
}

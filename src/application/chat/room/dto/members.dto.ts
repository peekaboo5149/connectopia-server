import { ArrayNotEmpty, ArrayUnique, IsArray } from 'class-validator'
export class MembersDto {
  @IsArray({ message: 'Members must be an array' })
  @ArrayNotEmpty({ message: 'Members must not be empty' })
  @ArrayUnique({ message: 'Members array must contain unique user IDs' })
  readonly members: string[] // User ids
}

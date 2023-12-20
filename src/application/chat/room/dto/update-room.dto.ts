import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateRoomDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  readonly name?: string
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  readonly description?: string
  @IsOptional()
  @IsEnum({ message: 'Opertion type can either be activate or deactive' })
  readonly opertionType?: 'activate' | 'deactivate'
}

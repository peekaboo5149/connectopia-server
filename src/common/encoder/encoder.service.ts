import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class EncoderService {
  private readonly salt = 10
  public async encode(str: string): Promise<string> {
    return await bcrypt.hash(str, this.salt)
  }

  public async compare(input: {
    original: string
    hash: string
  }): Promise<boolean> {
    return await bcrypt.compare(input.original, input.hash)
  }
}

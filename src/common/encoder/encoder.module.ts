import { Global, Module } from '@nestjs/common'
import { EncoderService } from './encoder.service'

@Global()
@Module({
  exports: [EncoderService],
  providers: [EncoderService],
})
export class EncoderModule {}

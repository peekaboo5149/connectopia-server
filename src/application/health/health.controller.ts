import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Public } from '../../common/auth/auth.decorator'

@Controller('health')
export class HealthController {
  @Public()
  @Get('heart')
  public async getHealth() {
    return {
      message: 'OK',
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('info')
  public async info() {
    return {
      message: 'classified',
    }
  }
}

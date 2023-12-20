import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Public } from '../../common/auth/auth.decorator'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get('heart')
  public async getHealth() {
    return this.healthService.checkHeartbeat()
  }

  @HttpCode(HttpStatus.OK)
  @Get('info')
  public async info() {
    return this.healthService.getInfo()
  }
}

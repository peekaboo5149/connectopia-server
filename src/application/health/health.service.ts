import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthService {
  checkHeartbeat() {
    // You can add more complex health-check logic here if needed
    return 'OK'
  }

  getInfo() {
    // This endpoint is marked as "classified," so you can customize the response accordingly
    // 🎯 Will do it later
    return 'Classified Information'
  }
}

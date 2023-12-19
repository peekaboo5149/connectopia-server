import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as fs from 'fs'
import { AppModule } from './app.module'

const logger = new Logger('BootStrap', { timestamp: true })
//Setup SSL options
const sslConfig = () => {
  const privateFilePath = './secret/private-key.pem'
  const certFilePath = './secret/public-certificate.pem'

  if (fs.existsSync(privateFilePath) && fs.existsSync(certFilePath)) {
    const privateFile = fs.readFileSync(privateFilePath)
    const cert = fs.readFileSync(certFilePath)

    return {
      key: privateFile,
      cert: cert,
    }
  }

  return null
}

const httpsOptions = sslConfig()

const getConfigKeyForPort = (isDev: boolean) => {
  let portConfigKey: string
  const isSSL = !!httpsOptions

  const logMessage = (sslStatus: string, modeStatus: string) => {
    logger[isDev ? 'warn' : 'log'](
      `${modeStatus} SSL ${sslStatus}: Server is using ${
        isSSL ? 'HTTPS.' : 'HTTP.'
      }`,
    )
  }

  if (isDev) {
    logMessage(
      isSSL ? 'enabled' : 'not enabled',
      'Running in Development mode.',
    )
    portConfigKey = isSSL ? 'DEV_HTTPS_PORT' : 'DEV_HTTP_PORT'
  } else {
    logMessage(isSSL ? 'enabled' : 'not enabled', '')
    portConfigKey = isSSL ? 'HTTPS_PORT' : 'HTTP_PORT'
  }
  return portConfigKey
}

async function bootstrap(isDev?: boolean) {
  const portConfigKey: string = getConfigKeyForPort(isDev)

  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix('/api/v1')
  app.useGlobalPipes(new ValidationPipe())
  const config = app.get<ConfigService>(ConfigService)
  const port = config.getOrThrow<string>(portConfigKey)
  try {
    await app.listen(port, () => logger.log(`Server running on port:${port}`))
  } catch (error) {
    const message = (error as Error).message
    if (
      message.includes('permission denied') &&
      config.get<string>('NODE_ENV') === 'development'
    ) {
      bootstrap(true)
    }
  }
}

const args = process.argv[2]
if (args === 'isDev') {
  bootstrap(true)
} else {
  bootstrap()
}

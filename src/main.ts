import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setUpApiDocs } from './shared/utils/api.util'
import { getConfigKeyForPort, httpsOptions } from './shared/utils/server.util'

const bootstrap = async (isDev?: boolean): Promise<void> => {
  const logger = new Logger('BootStrap', { timestamp: true })
  const portConfigKey: string = getConfigKeyForPort(isDev, logger)
  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix('/api/v1')
  app.enableCors({ origin: '*' }) // In Dev
  app.useGlobalPipes(new ValidationPipe())
  const config = app.get<ConfigService>(ConfigService)
  const port = config.getOrThrow<string>(portConfigKey)
  try {
    setUpApiDocs(app, config.get<string>('DOCS_ENDPOINT', 'docs'))
    await app.listen(port, () => logger.log(`Server running on port:${port}`))
    app.enableShutdownHooks() // To handle any logic implemented in onApplicationShutDown
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

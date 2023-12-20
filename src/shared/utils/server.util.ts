import { Logger } from '@nestjs/common'
import * as fs from 'fs'
import { SSLConfig } from '../types'

const sslConfig = (): SSLConfig => {
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

export const httpsOptions = sslConfig()

export const getConfigKeyForPort = (isDev: boolean, logger: Logger) => {
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

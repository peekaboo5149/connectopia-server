import { INestApplication } from '@nestjs/common'
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger'

export const setUpApiDocs = (app: INestApplication, route: string): void => {
  const config = new DocumentBuilder()
    .setTitle('Connectopia')
    .setDescription('Connectopia API Documentation')
    .setVersion('1.0')
    .addTag('api')
    .build()
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup(route, app, document)
}

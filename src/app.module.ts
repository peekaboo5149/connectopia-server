import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ApplicationModule } from './application/application.module'
import { AuthModule } from './common/auth/auth.module'
import { EncoderModule } from './common/encoder/encoder.module'
import { ApiExceptionFilter } from './common/filters/apiexception.filter'
import { AppLoggerMiddleware } from './common/middleware/logger.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
        retryWrites: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ApplicationModule,
    EncoderModule,
  ],
  providers: [{ provide: APP_FILTER, useValue: ApiExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
  }
}

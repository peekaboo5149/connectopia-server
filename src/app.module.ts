import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ApplicationModule } from './application/application.module'
import { ApiexceptionFilter } from './common/filters/apiexception.filter'
import { EncoderModule } from './common/encoder/encoder.module';

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
    ApplicationModule,
    EncoderModule,
  ],
  providers: [{ provide: APP_FILTER, useValue: ApiexceptionFilter }],
})
export class AppModule {}

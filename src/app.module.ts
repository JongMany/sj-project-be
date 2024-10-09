import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
// import Joi from 'joi';
import { join } from 'path';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { GptModule } from './gpt/gpt.module';
import appConfig from 'src/config/app.config';
import dbConfig from 'src/config/db.config';
import gptConfig from 'src/config/gpt.config';

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [appConfig, dbConfig, gptConfig], // * 여러개의 config를 로드할 수 있다.
      // validationSchema: Joi.object({
      //   // API
      //   PORT: Joi.number().required(),
      //   SECRET: Joi.string().required(),
      //   JWT_SECRET: Joi.string().required(),
      //   JWT_EXPIRATION_TIME: Joi.number().required(),
      //   RT_JWT_SECRET: Joi.string().required(),
      //   RT_JWT_EXPIRATION_TIME: Joi.number().required(),
      //   NODE_ENV: Joi.string().valid('development', 'production').required(),
      //   // PostgreSQL
      //   DB_USER: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DB_NAME: Joi.string().required(),
      //   DB_PORT: Joi.number().required(),
      //   DB_HOST: Joi.string().required(),
      //   // MongoDB
      //   MONGO_DB: Joi.string().required(),
      //   MONGO_URI: Joi.string().required(),
      //   // Redis
      //   REDIS_URL: Joi.string().required(),
      //   // Google
      //   GOOGLE_CLIENT_ID: Joi.string().required(),
      //   GOOGLE_CLIENT_SECRET: Joi.string().required(),
      //   GOOGLE_CALLBACK_URL: Joi.string().required(),
      // }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: ['dist/**/*.entity{.ts,.js}'],
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        // entities: [UserEntity],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        // dropSchema: true,
      }),
    }),
    AuthModule,
    RedisModule,
    UserModule,
    GptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // console.log(join(__dirname, '**'));
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule as RedisCacheModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
// import Joi from 'joi';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { join } from 'path';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { GptModule } from './gpt/gpt.module';
import { MemoryModule } from './memory/memory.module';
import appConfig from 'src/config/app.config';
import dbConfig from 'src/config/db.config';
import gptConfig from 'src/config/gpt.config';

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
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('db.postgres.host'),
          port: parseInt(configService.get<string>('db.postgres.port'), 10),
          username: configService.get<string>('db.postgres.username'),
          password: configService.get<string>('db.postgres.password'),
          database: configService.get<string>('db.postgres.name'),
          // entities: ['dist/**/*.entity{.ts,.js}'],
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            host: configService.get('db.redis.host'),
            port: configService.get('db.redis.port'),
            password: configService.get('db.redis.password'),
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    RedisCacheModule,
    UserModule,
    GptModule,
    MemoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer): void {
    // console.log(join(__dirname, '**'));
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

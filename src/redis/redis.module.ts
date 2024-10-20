import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { IORedisKey } from 'src/redis/redis.constants';

@Global()
@Module({
  // controllers: [RedisController],
  providers: [
    {
      provide: IORedisKey,
      useFactory: async (configService: ConfigService) => {
        console.log('REDIS_URL', configService.get('db.redis.url'));
        return new Redis(configService.get('db.redis.url'));
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(signal?: string) {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(IORedisKey);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}

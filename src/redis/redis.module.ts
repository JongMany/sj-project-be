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
        return new Redis(configService.get('REDIS_URL'));
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
    console.log('Shutting down Redis connection', signal);
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(IORedisKey);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}

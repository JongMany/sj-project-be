import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemoryModule } from 'src/memory/memory.module';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([ThreadEntity, UserEntity]),
    MemoryModule,
  ],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}

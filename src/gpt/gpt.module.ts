import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([ThreadEntity, UserEntity])],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}

import { Module } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { MemoryController } from './memory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryEntity } from 'src/memory/entities/memory.entity';
import { JwtModule } from '@nestjs/jwt';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([MemoryEntity, ThreadEntity])],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoryModule {}

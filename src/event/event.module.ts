import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import {
  ChatEventLogEntity,
  MemoryEventLogEntity,
} from 'src/event/entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemoryEventLogEntity, ChatEventLogEntity]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import {
  ChatEventLogEntity,
  MemoryEventLogEntity,
} from 'src/event/entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemoryEventLogEntity, ChatEventLogEntity]),
    UserModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}

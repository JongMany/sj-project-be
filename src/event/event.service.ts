import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatEventLogDto } from 'src/event/dto/create-chat-event-log.dto';
import { CreateMemoryEventLogDto } from 'src/event/dto/create-memory-event-log.dto';
import {
  ChatEventLogEntity,
  MemoryEventLogEntity,
} from 'src/event/entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(MemoryEventLogEntity)
    private readonly memoryEventLogRepository: Repository<MemoryEventLogEntity>,
    @InjectRepository(ChatEventLogEntity)
    private readonly chatEventLogRepository: Repository<ChatEventLogEntity>,
  ) {}

  async createMemoryEventLog(createMemoryEventLogDto: CreateMemoryEventLogDto) {
    const memoryEventLog = this.memoryEventLogRepository.create(
      createMemoryEventLogDto,
    );
    return await this.memoryEventLogRepository.save(memoryEventLog);
  }

  async createChatEventLog(createChatEventLogDto: CreateChatEventLogDto) {
    const chatEventLog = this.chatEventLogRepository.create(
      createChatEventLogDto,
    );
    return await this.chatEventLogRepository.save(chatEventLog);
  }
}

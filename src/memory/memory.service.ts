import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { GptService } from 'src/gpt/gpt.service';
// import { GptService } from 'src/gpt/gpt.service';
import { MemoryEntity } from 'src/memory/entities/memory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(MemoryEntity)
    private memoryRepository: Repository<MemoryEntity>,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
  ) {}

  async createMemory(createMemoryDto: { threadId: string; memoryData: any }) {
    const { threadId, memoryData } = createMemoryDto;

    const thread = await this.threadRepository.findOne({ where: { threadId } });

    if (!thread) {
      throw new Error('Thread not found');
    }

    // MemoryEntity 생성
    const memory = this.memoryRepository.create({
      threadId: thread,
      data: memoryData,
    });

    // 저장
    await this.memoryRepository.save(memory);

    console.log('Memory created');

    return JSON.stringify(memory);
  }

  // async saveMemory(threadId: string, dataToMemorize: any) {
  //   const memory = await this.memoryRepository.findOne({
  //     where: { thread: { threadId } },
  //   });
  //   if (!memory) {
  //     const newMemory = new MemoryEntity();
  //     newMemory.thread = threadId;
  //     newMemory.data = dataToMemorize;
  //     await this.memoryRepository.save(newMemory);
  //     return;
  //   }
  //   await this.memoryRepository.save(memory);
  // }
}

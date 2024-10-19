import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { validate as isUuid } from 'uuid';
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
    // threadId가 UUID 형식인지 확인

    // threadId로 ThreadEntity 찾기
    const thread = await this.threadRepository.findOne({
      where: { threadId: threadId },
    });
    if (!thread) {
      throw new Error('Thread not found');
    }

    // MemoryEntity 생성
    const memory = this.memoryRepository.create({
      thread,
      data: memoryData,
    });

    // 저장
    await this.memoryRepository.save(memory);

    console.log('Memory created');

    return JSON.stringify(memory);
  }

  async getMemoriesByThreadId(threadId: string): Promise<MemoryEntity[]> {
    // threadId를 기반으로 Memory 리스트 가져오기
    return this.memoryRepository.find({
      where: {
        thread: { threadId: threadId }, // 관계된 ThreadEntity의 id를 사용하여 필터링
      },
      // relations: ['thread'], // 필요 시 연관 관계를 로드
    });
  }
}

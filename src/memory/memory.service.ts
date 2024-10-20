import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { validate as isUuid } from 'uuid';
import { MemoryEntity } from 'src/memory/entities/memory.entity';
import { Repository } from 'typeorm';
import { UserProfileParams } from 'src/constants/function_calling';

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(MemoryEntity)
    private memoryRepository: Repository<MemoryEntity>,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
  ) {}

  async createMemory(createMemoryDto: {
    threadId: string;
    memoryData: UserProfileParams;
  }) {
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
    Object.entries(memoryData).forEach(async ([key, value]) => {
      // userId, name은 제외하고 저장
      if (!['userId', 'name'].includes(key)) {
        const memory = this.memoryRepository.create({
          thread,
          data: { [key]: value },
        });
        // 저장
        await this.memoryRepository.save(memory);
      }
    });

    console.log('Memory created: ', memoryData);

    return JSON.stringify(memoryData);
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

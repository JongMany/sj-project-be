import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { MemoryEntity } from 'src/memory/entities/memory.entity';
import { Repository } from 'typeorm';
import { UserProfileParams } from 'src/constants/function_calling';
import { UserProfileDetailEntity } from 'src/memory/entities/user-profile-detail.entity';

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(MemoryEntity)
    private memoryRepository: Repository<MemoryEntity>,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
    @InjectRepository(UserProfileDetailEntity)
    private readonly userProfileDetailRepository: Repository<UserProfileDetailEntity>,
  ) {}

  async createMemory(createMemoryDto: {
    threadId: string;
    // memoryData: UserProfileParams;
    memoryData: any;
  }) {
    const { threadId, memoryData } = createMemoryDto;
    console.log('createMemoryDto', createMemoryDto.memoryData);

    const {
      userId,
      name,
      age,
      preferences,
      things_to_do,
      things_done,
      things_to_do_later,
    } = memoryData;

    // threadId로 ThreadEntity 찾기
    const thread = await this.threadRepository.findOne({
      where: { threadId: threadId },
    });
    if (!thread) {
      throw new Error('Thread not found');
    }

    // threadId로 MemoryEntity가 이미 존재하는지 확인
    let memory = await this.memoryRepository.findOne({
      where: { thread: { threadId: threadId } },
    });

    // MemoryEntity가 없으면 새로 생성
    if (!memory) {
      memory = new MemoryEntity();
      memory.thread = thread; // ThreadEntity와 연결
      memory = await this.memoryRepository.save(memory); // 저장
    }

    // TODO: 나이가 있으면 저장을 안해야하는지...
    if (age) {
      await this.saveProfileDetail(userId, 'age', `${age}`, memory);
    }

    if (preferences) {
      if (preferences.favorite_color) {
        await this.saveProfileDetail(
          userId,
          'favorite_color',
          `${preferences.favorite_color}`,
          memory,
        );
      }
      if (preferences.favorite_food) {
        await this.saveProfileDetail(
          userId,
          'favorite_food',
          `${preferences.favorite_food}`,
          memory,
        );
      }
      if (preferences.hobbies) {
        for (const hobby of preferences.hobbies) {
          await this.saveProfileDetail(userId, 'hobby', `${hobby}`, memory);
        }
      }
    }

    if (things_to_do) {
      for (const task of things_to_do) {
        await this.saveProfileDetail(userId, 'things_to_do', `${task}`, memory);
      }
    }

    if (things_done) {
      for (const done of things_done) {
        await this.saveProfileDetail(userId, 'things_done', `${done}`, memory);
      }
    }

    if (things_to_do_later) {
      for (const task of things_to_do_later) {
        await this.saveProfileDetail(
          userId,
          'things_to_do_later',
          `${task}`,
          memory,
        );
      }
    }

    return JSON.stringify(memoryData);
  }

  async getMemoriesByThreadId(
    threadId: string,
  ): Promise<UserProfileDetailEntity[]> {
    // threadId를 기반으로 Memory 리스트 가져오기
    const memory = await this.memoryRepository.find({
      where: {
        thread: { threadId: threadId }, // 관계된 ThreadEntity의 id를 사용하여 필터링
      },
      // relations: ['thread'], // 필요 시 연관 관계를 로드
    });

    const userProfileDetails = await this.userProfileDetailRepository.find({
      where: {
        memory: memory,
      },
    });

    return userProfileDetails;
  }

  private async saveProfileDetail(
    userId: string,
    type: string,
    description: string,
    memory: MemoryEntity,
  ): Promise<void> {
    const profileDetail = new UserProfileDetailEntity();
    profileDetail.userId = userId;
    profileDetail.type = type;
    profileDetail.description = description;
    profileDetail.memory = memory; // memoryId 연결
    await this.userProfileDetailRepository.save(profileDetail);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { MemoryEntity } from 'src/memory/entities/memory.entity';
import { Repository } from 'typeorm';
import { UserProfileParams } from 'src/constants/function_calling';
import { UserProfileDetailEntity } from 'src/memory/entities/user-profile-detail.entity';
import { EditMemoryDto } from 'src/memory/dto/edit-memory.dto';

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

    // const {
    //   userId,
    //   name,
    //   age,
    //   preferences,
    //   things_to_do,
    //   things_done,
    //   things_to_do_later,
    // } = memoryData;

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

    const { personal_info, likes, dislikes, recent_updates, activities } =
      memoryData;

    // TODO: 나이가 있으면 저장을 안해야하는지...
    if (personal_info) {
      const {
        age,
        gender,
        job,
        personality,
        living_arrangement,
        family_relationship,
        interpersonal_relationships,
      } = personal_info;

      if (age) {
        await this.saveProfileDetail('personal_info_age', `${age}`, memory);
      }
      if (gender) {
        await this.saveProfileDetail(
          'personal_info_gender',
          `${gender}`,
          memory,
        );
      }
      if (job) {
        await this.saveProfileDetail('personal_info_job', `${job}`, memory);
      }
      if (personality) {
        await this.saveProfileDetail(
          'personal_info_personality',
          `${personality}`,
          memory,
        );
      }
      if (living_arrangement) {
        await this.saveProfileDetail(
          'personal_info_living_arrangement',
          `${living_arrangement}`,
          memory,
        );
      }
      if (family_relationship) {
        await this.saveProfileDetail(
          'personal_info_family_relationship',
          `${family_relationship}`,
          memory,
        );
      }
      if (
        interpersonal_relationships &&
        interpersonal_relationships.length > 0
      ) {
        for (const relation of interpersonal_relationships) {
          await this.saveProfileDetail(
            'personal_info_interpersonal_relationship',
            `The user has a relationship with ${relation}`,
            memory,
          );
        }
      }
    }

    if (likes) {
      for (const [category, items] of Object.entries(likes)) {
        if (Array.isArray(items)) {
          for (const item of items) {
            await this.saveProfileDetail(`like_${category}`, `${item}`, memory);
          }
        }
      }
    }

    // Dislikes 저장
    if (dislikes) {
      for (const [category, items] of Object.entries(dislikes)) {
        if (Array.isArray(items)) {
          for (const item of items) {
            await this.saveProfileDetail(
              `dislike_${category}`,
              `${item}`,
              memory,
            );
          }
        }
      }
    }

    // 근황
    if (recent_updates) {
      const {
        interests,
        concerns,
        daily_life,
        relationship_updates,
        future_plans,
        anxieties,
        goals,
      } = recent_updates;

      if (interests && interests.length > 0) {
        for (const interest of interests) {
          await this.saveProfileDetail(
            'recent_updates_interest',
            `${interest}`,
            memory,
          );
        }
      }
      if (concerns && concerns.length > 0) {
        for (const concern of concerns) {
          await this.saveProfileDetail(
            'recent_updates_concern',
            `${concern}`,
            memory,
          );
        }
      }
      if (daily_life)
        await this.saveProfileDetail(
          'recent_updates_daily_life',
          `${daily_life}`,
          memory,
        );
      if (relationship_updates)
        await this.saveProfileDetail(
          'recent_updates_relationship_update',
          `${relationship_updates}`,
          memory,
        );
      if (future_plans)
        await this.saveProfileDetail(
          'recent_updates_future_plans',
          `${future_plans}`,
          memory,
        );
      if (anxieties)
        await this.saveProfileDetail(
          'recent_updates_anxieties',
          `${anxieties}`,
          memory,
        );
      if (goals)
        await this.saveProfileDetail(
          'recent_updates_goals',
          `${goals}`,
          memory,
        );
    }
    if (activities) {
      const { past, current, future } = activities;

      if (past && past.length > 0) {
        for (const activity of past) {
          await this.saveProfileDetail(
            'activities_past_activity',
            `${activity}`,
            memory,
          );
        }
      }
      if (current && current.length > 0) {
        for (const activity of current) {
          await this.saveProfileDetail(
            'activities_current_activity',
            `${activity}`,
            memory,
          );
        }
      }
      if (future && future.length > 0) {
        for (const activity of future) {
          await this.saveProfileDetail(
            'activities_future_activity',
            `${activity}`,
            memory,
          );
        }
      }
    }
    // if (preferences) {
    //   if (preferences.favorite_color) {
    //     await this.saveProfileDetail(
    //       userId,
    //       'favorite_color',
    //       `${preferences.favorite_color}`,
    //       memory,
    //     );
    //   }
    //   if (preferences.favorite_food) {
    //     await this.saveProfileDetail(
    //       userId,
    //       'favorite_food',
    //       `${preferences.favorite_food}`,
    //       memory,
    //     );
    //   }
    //   if (preferences.hobbies) {
    //     for (const hobby of preferences.hobbies) {
    //       await this.saveProfileDetail(userId, 'hobby', `${hobby}`, memory);
    //     }
    //   }
    // }

    // if (things_to_do) {
    //   for (const task of things_to_do) {
    //     await this.saveProfileDetail(userId, 'things_to_do', `${task}`, memory);
    //   }
    // }

    // if (things_done) {
    //   for (const done of things_done) {
    //     await this.saveProfileDetail(userId, 'things_done', `${done}`, memory);
    //   }
    // }

    // if (things_to_do_later) {
    //   for (const task of things_to_do_later) {
    //     await this.saveProfileDetail(
    //       userId,
    //       'things_to_do_later',
    //       `${task}`,
    //       memory,
    //     );
    //   }
    // }

    return JSON.stringify(memoryData);
  }

  async getMemoriesByThreadId(
    threadId: string,
  ): Promise<UserProfileDetailEntity[]> {
    // threadId를 기반으로 Memory 리스트 가져오기
    const memory = await this.memoryRepository.findOne({
      where: {
        thread: { threadId }, // 관계된 ThreadEntity의 id를 사용하여 필터링
      },
      relations: ['thread'], // 필요 시 연관 관계를 로드
    });

    if (!memory) {
      return [];
    }

    const userProfileDetails = await this.userProfileDetailRepository.find({
      where: {
        memory: memory,
        isShow: true,
      },
    });

    return userProfileDetails;
  }

  private async saveProfileDetail(
    // userId: string,
    type: string,
    description: string,
    memory: MemoryEntity,
  ): Promise<void> {
    const profileDetail = new UserProfileDetailEntity();
    // profileDetail.userId = userId;
    profileDetail.type = type;
    profileDetail.description = description;
    profileDetail.memory = memory; // memoryId 연결
    await this.userProfileDetailRepository.save(profileDetail);
  }

  async deleteMemory(memoryId: string) {
    const memory = await this.userProfileDetailRepository.findOne({
      where: { id: memoryId },
      relations: ['memory'],
    });

    if (!memory) {
      throw new Error('Memory not found');
    }

    // isShow 값 업데이트
    memory.isShow = false;

    // 변경된 MemoryEntity 저장
    await this.userProfileDetailRepository.save(memory);
    const memories = await this.userProfileDetailRepository.find({
      where: { memory: memory.memory },
    });
    return memories.filter((value) => value.isShow);
  }

  async updateMemory(memoryId: string, editMemoryDto: EditMemoryDto) {
    const memory = await this.userProfileDetailRepository.findOne({
      where: { id: memoryId },
    });

    if (!memory) {
      throw new Error('Memory not found');
    }

    memory.description = editMemoryDto.description;

    return await this.userProfileDetailRepository.save(memory);
  }
}

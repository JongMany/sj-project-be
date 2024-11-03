import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ThreadEntity } from "src/gpt/entities/thread.entity";
import { MemoryEntity } from "src/memory/entities/memory.entity";
import { Repository } from "typeorm";
import { UserProfileParams } from "src/constants/function_calling";
import { UserProfileDetailEntity } from "src/memory/entities/user-profile-detail.entity";
import { EditMemoryDto } from "src/memory/dto/edit-memory.dto";

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(MemoryEntity)
    private memoryRepository: Repository<MemoryEntity>,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
    @InjectRepository(UserProfileDetailEntity)
    private readonly userProfileDetailRepository: Repository<UserProfileDetailEntity>
  ) {
  }

  async createMemory(createMemoryDto: {
    threadId: string;
    // memoryData: UserProfileParams;
    memoryData: any;
  }) {
    const { threadId, memoryData } = createMemoryDto;


    // threadId로 ThreadEntity 찾기
    const thread = await this.threadRepository.findOne({
      where: { threadId: threadId }
    });
    if (!thread) {
      throw new Error("Thread not found");
    }

    // threadId로 MemoryEntity가 이미 존재하는지 확인
    let memory = await this.memoryRepository.findOne({
      // where: { thread: { threadId: threadId } },
      where: { thread }
    });

    // MemoryEntity가 없으면 새로 생성
    if (!memory) {
      memory = new MemoryEntity();
      memory.thread = thread; // ThreadEntity와 연결
      memory = await this.memoryRepository.save(memory); // 저장
    }

    const { personal_info, likes, dislikes, recent_updates, activities } =
      memoryData;

    const addedDetails = [];

    const trackAddition = async (type: string, description: string) => {
      const isAdded = await this.saveProfileDetail(type, description, memory);
      if (isAdded) {
        addedDetails.push({ type, description });
      }
    };

    if (personal_info) {
      const {
        age,
        gender,
        job,
        personality,
        living_arrangement,
        family_relationship,
        interpersonal_relationships
      } = personal_info;

      if (age) await trackAddition("personal_info_age", `${age}`);
      if (gender) await trackAddition("personal_info_gender", `${gender}`);
      if (job) await trackAddition("personal_info_job", `${job}`);
      if (personality) await trackAddition("personal_info_personality", `${personality}`);
      if (living_arrangement) await trackAddition("personal_info_living_arrangement", `${living_arrangement}`);
      if (family_relationship) await trackAddition("personal_info_family_relationship", `${family_relationship}`);
      if (interpersonal_relationships && interpersonal_relationships.length > 0) {
        for (const relation of interpersonal_relationships) {
          await trackAddition("personal_info_interpersonal_relationship", `The user has a relationship with ${relation}`);
        }
      }
    }

    if (likes) {
      for (const [category, items] of Object.entries(likes)) {
        if (Array.isArray(items)) {
          for (const item of items) {
            await trackAddition(`like_${category}`, `${item}`);
          }
        }
      }
    }

    if (dislikes) {
      for (const [category, items] of Object.entries(dislikes)) {
        if (Array.isArray(items)) {
          for (const item of items) {
            await trackAddition(`dislike_${category}`, `${item}`);
          }
        }
      }
    }

    if (recent_updates) {
      const { interests, concerns, daily_life, relationship_updates, future_plans, anxieties, goals } = recent_updates;

      if (interests && interests.length > 0) {
        for (const interest of interests) {
          await trackAddition("recent_updates_interest", `${interest}`);
        }
      }
      if (concerns && concerns.length > 0) {
        for (const concern of concerns) {
          await trackAddition("recent_updates_concern", `${concern}`);
        }
      }
      if (daily_life) await trackAddition("recent_updates_daily_life", `${daily_life}`);
      if (relationship_updates) await trackAddition("recent_updates_relationship_update", `${relationship_updates}`);
      if (future_plans) await trackAddition("recent_updates_future_plans", `${future_plans}`);
      if (anxieties) await trackAddition("recent_updates_anxieties", `${anxieties}`);
      if (goals) await trackAddition("recent_updates_goals", `${goals}`);
    }

    if (activities) {
      const { past, current, future } = activities;

      if (past && past.length > 0) {
        for (const activity of past) {
          await trackAddition("activities_past_activity", `${activity}`);
        }
      }
      if (current && current.length > 0) {
        for (const activity of current) {
          await trackAddition("activities_current_activity", `${activity}`);
        }
      }
      if (future && future.length > 0) {
        for (const activity of future) {
          await trackAddition("activities_future_activity", `${activity}`);
        }
      }
    }

    return {
      memoryData: JSON.stringify(memoryData),
      isFunctionCalling: addedDetails.length > 0,
    };
  }

  private async saveProfileDetail(
    // userId: string,
    type: string,
    description: string,
    memory: MemoryEntity
  ): Promise<boolean> {
    // 중복 여부 확인
    const existingDetail = await this.userProfileDetailRepository.findOne({
      where: { memory: memory, type, description }
    });

    // 중복된 경우 저장하지 않고 종료
    if (existingDetail) {
      console.log(`중복된 항목이므로 저장하지 않습니다: ${description}`);
      return false;
    }
    const profileDetail = new UserProfileDetailEntity();
    // profileDetail.userId = userId;
    profileDetail.type = type;
    profileDetail.description = description;
    profileDetail.memory = memory; // memoryId 연결
    await this.userProfileDetailRepository.save(profileDetail);

    return true;
  }

  async getMemoriesByThreadId(
    threadId: string,
  ): Promise<UserProfileDetailEntity[]> {
    // threadId를 기반으로 Memory 리스트 가져오기
    const memory = await this.memoryRepository.findOne({
      where: {
        thread: { threadId } // 관계된 ThreadEntity의 id를 사용하여 필터링
      },
      relations: ["thread"] // 필요 시 연관 관계를 로드
    });

    if (!memory) {
      return [];
    }

    const userProfileDetails = await this.userProfileDetailRepository.find({
      where: {
        memory: memory,
        isShow: true
      }
    });

    return userProfileDetails;
  }


  async deleteMemory(memoryId: string) {
    const memory = await this.userProfileDetailRepository.findOne({
      where: { id: memoryId },
      relations: ["memory", "memory.thread"]
    });

    if (!memory) {
      throw new Error("Memory not found");
    }

    // isShow 값 업데이트
    memory.isShow = false;

    // 변경된 MemoryEntity 저장
    await this.userProfileDetailRepository.save(memory);
    const memories = await this.userProfileDetailRepository.find({
      where: { memory: memory.memory }
    });
    return {
      memories: memories.filter((value) => value.isShow),
      threadType: memory.memory.thread.type
    };
  }

  async updateMemory(memoryId: string, description: string) {
    const memory = await this.userProfileDetailRepository.findOne({
      where: { id: memoryId }
    });

    if (!memory) {
      throw new Error("Memory not found");
    }

    memory.description = description;

    return await this.userProfileDetailRepository.save(memory);
  }
}

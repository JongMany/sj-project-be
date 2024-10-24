import { MemoryEntity } from './memory.entity'; // MemoryEntity 임포트
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_profile_details')
export class UserProfileDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MemoryEntity, (memory) => memory.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'memoryId' }) // memoryId를 외래 키로 지정
  memory: MemoryEntity;

  @Column()
  userId: string;

  @Column()
  type: string; // e.g., 'name', 'age', 'hobby', etc.

  @Column()
  description: string; // 실제 값 (예: '30 years old', '커피 마시기')

  @Column({ default: true })
  isShow: boolean; // 프로필에 표시할지 여부
}

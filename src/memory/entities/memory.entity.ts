import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { UserProfileDetailEntity } from 'src/memory/entities/user-profile-detail.entity';
import {
  // Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('memories')
export class MemoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ThreadEntity, (thread) => thread.threadId, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'threadId' })
  thread: ThreadEntity;


  // @Column({ type: 'jsonb', nullable: false, default: {} })
  // data: any; // 비정형 데이터를 저장할 필드

  // @Column({ type: 'jsonb' })
  // data: any; // 비정형 데이터를 저장할 필드
  @OneToMany(() => UserProfileDetailEntity, (detail) => detail.memory)
  details: UserProfileDetailEntity[];


}

import { MemoryEntity } from 'src/memory/entities/memory.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('threads')
@Unique(['user', 'type']) //user와 type을 기반으로 유니크 제약조건 생성
export class ThreadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.threads, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user' }) // 외래 키로 사용할 필드 명시
  user: UserEntity;

  @Column()
  threadId: string;

  @Column({
    type: 'enum',
    enum: ['Funny', 'Feedback', 'Kind', 'Default'],
    default: 'Default',
  })
  type: 'Funny' | 'Feedback' | 'Kind' | 'Default';

  @OneToMany(() => MemoryEntity, (memory) => memory.thread)
  memories: MemoryEntity[];
}

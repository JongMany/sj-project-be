import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('threads')
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
}

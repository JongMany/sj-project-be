import {
  Column,
  CreateDateColumn,
  Entity,
  // JoinColumn,
  // OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity('event_logs')
@TableInheritance({ column: { type: 'varchar', name: 'eventType' } })
abstract class EventLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('memory_event_logs')
export class MemoryEventLogEntity extends EventLogEntity {
  // @Column()
  // elementId: string;

  @Column({ type: 'enum', enum: ['Watch', 'Delete', 'Edit'] })
  eventType: 'Watch' | 'Delete' | 'Edit';

  @Column({ type: 'enum', enum: ['Funny', 'Feedback', 'Kind', 'Default'] })
  agentType: 'Funny' | 'Feedback' | 'Kind' | 'Default';

  // @OneToOne(() => EventLogEntity)
  // @JoinColumn()
  // event: EventLogEntity;
}

@Entity('chat_event_logs')
export class ChatEventLogEntity extends EventLogEntity {
  // @Column()
  // elementId: string;

  @Column({ default: 'chat' })
  eventType: string;

  @Column({ type: 'enum', enum: ['Funny', 'Feedback', 'Kind', 'Default'] })
  agentType: 'Funny' | 'Feedback' | 'Kind' | 'Default';

  // @OneToOne(() => EventLogEntity)
  // @JoinColumn()
  // event: EventLogEntity;
}

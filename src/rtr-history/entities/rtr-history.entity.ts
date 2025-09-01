import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RTR } from '../../rtr/entities/rtr.entity';
import { User } from '../../users/entities/user.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('rtr_history')
export class RTRHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rtrId: string;

  @Column()
  userId: string;

  @Column()
  action: string; // e.g., "created", "sent", "viewed", "signed", "expired"

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => RTR, (rtr) => rtr.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rtrId' })
  rtr: RTR;

  @ManyToOne(() => User, (user) => user.rtrHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

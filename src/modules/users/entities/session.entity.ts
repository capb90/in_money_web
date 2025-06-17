import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public refreshTokenHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @Column({ name: 'revoke_at', type: 'timestamp', nullable: true })
  public revokeAt: Date | null;

  //Relations:
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}

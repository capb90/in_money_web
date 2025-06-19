import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('session')
export class Session {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public refreshTokenHash: string;

  @Column({ name: 'device_info', type: 'varchar', nullable: true })
  public deviceInfo: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @Column({ name: 'revoke_at', type: 'timestamp' })
  public revokeAt: Date;

  //Relations:
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}

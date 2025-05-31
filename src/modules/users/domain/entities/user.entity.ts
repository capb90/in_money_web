import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthTypes } from '../interfaces/auth-types.enum';

@Entity('user')
@Index(['email'], { unique: true })
@Index(['name'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ name: 'email_verified', type: 'timestamp', nullable: true })
  emailVerified: Date;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ name: 'verify_email', type: 'boolean', default: false })
  verifyEmail: boolean;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion: string;

  @Column({
    name: 'auth_provider',
    type: 'enum',
    enum: AuthTypes,
    default: AuthTypes.LOCAL,
    nullable: false,
  })
  authProvider: AuthTypes;

  @Column({
    name: 'auth_provider_id',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  authProviderId: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

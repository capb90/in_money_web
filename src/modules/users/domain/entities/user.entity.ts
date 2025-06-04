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
  public id: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public email: string;

  @Column({ name: 'email_verified', type: 'timestamp', nullable: true })
  public emailVerified: Date;

  @Column({ type: 'varchar', nullable: true })
  public image: string;

  @Column({ name: 'verify_email', type: 'boolean', default: false })
  public verifyEmail: boolean;

  @Column({ type: 'varchar', nullable: true })
  public password: string;

  @Column({ name: 'token_version', type: 'int', default: 0 })
  public tokenVersion: string;

  @Column({
    name: 'auth_provider',
    type: 'enum',
    enum: AuthTypes,
    default: AuthTypes.LOCAL,
    nullable: false,
  })
  public authProvider: AuthTypes;

  @Column({
    name: 'auth_provider_id',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  public authProviderId: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  public active: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  public lastLogin: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updatedAt: Date;
}

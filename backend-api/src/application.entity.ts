import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { JobPosting } from './job-posting.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string; 
  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => JobPosting, (job) => job.applications)
  jobPosting: JobPosting;
}
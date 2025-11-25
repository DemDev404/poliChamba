import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobPosting } from './job-posting.entity';
import { CompanyRecruiter } from './company-recruiter.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @OneToMany(() => JobPosting, (job) => job.company)
  jobPostings: JobPosting[];

  @OneToMany(() => CompanyRecruiter, (recruiter) => recruiter.company)
  recruiters: CompanyRecruiter[];
}
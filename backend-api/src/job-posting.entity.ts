import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { JobSkill } from './job-skill.entity';

@Entity('job_postings')
export class JobPosting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column()
  jobType: string;

  @Column()
  experienceLevel: string;

  @CreateDateColumn()
  postedAt: Date;

  @ManyToOne(() => Company, (company) => company.jobPostings)
  company: Company;

  @OneToMany(() => Application, (app) => app.jobPosting)
  applications: Application[];

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.jobPosting)
  skillsRequired: JobSkill[];
}
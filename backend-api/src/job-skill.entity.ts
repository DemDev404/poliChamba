import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JobPosting } from './job-posting.entity';
import { Skill } from './skill.entity';

@Entity('job_skills')
export class JobSkill {
  @PrimaryColumn()
  jobPostingId: number;

  @PrimaryColumn()
  skillId: number;

  @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.skillsRequired, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobPostingId' })
  jobPosting: JobPosting;

  @ManyToOne(() => Skill, (skill) => skill.jobSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
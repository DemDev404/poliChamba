import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobSkill } from './job-skill.entity';
import { UserSkill } from './user-skill.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.skill)
  jobSkills: JobSkill[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills: UserSkill[];
}
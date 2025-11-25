// backend-api/src/user-skill.entity.ts
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Skill } from './skill.entity';

@Entity('user_skills')
export class UserSkill {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  skillId: number;

  @ManyToOne(() => User, (user) => user.userSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('company_recruiters')
export class CompanyRecruiter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recruiterProfiles)
  user: User;

  @ManyToOne(() => Company, (company) => company.recruiters)
  company: Company;
}
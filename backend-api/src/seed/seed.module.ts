import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';

// Importamos las entidades que el servicio va a usar
import { Role } from '../role.entity';
import { Skill } from '../skill.entity';
import { Company } from '../company.entity';
import { User } from '../user.entity';
import { JobPosting } from '../job-posting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Skill,
      Company,
      User,
      JobPosting,
    ]),
  ],
  providers: [SeedService], 
})
export class SeedModule {}
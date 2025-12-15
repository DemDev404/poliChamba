import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Role } from './role.entity';
import { Skill } from './skill.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { JobPosting } from './job-posting.entity';
import { Application } from './application.entity';
import { UserSkill } from './user-skill.entity';
import { JobSkill } from './job-skill.entity';
import { CompanyRecruiter } from './company-recruiter.entity';

import { SeedModule } from './seed/seed.module';
import { JobPostingModule } from './job-posting/job-posting.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password123',
      database: 'indeed_db',
      entities: [
        Role,
        Skill,
        Company,
        User,
        JobPosting,
        Application,
        UserSkill,
        JobSkill,
        CompanyRecruiter,
      ],
      synchronize: true,
      dropSchema: false,
    }),
    
    TypeOrmModule.forFeature([User, JobPosting, Application, Company]), 

    SeedModule,
    JobPostingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
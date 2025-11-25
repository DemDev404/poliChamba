import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { JobPosting } from '../job-posting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPosting]),
  ],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
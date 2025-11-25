import { Controller, Get } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';

@Controller('job-posting') 
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Get()
  findAll() {
    return this.jobPostingService.findAll(); 
  }
}
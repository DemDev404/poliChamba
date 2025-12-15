import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';

@Controller('job-posting') 
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Get()
  findAll() {
    return this.jobPostingService.findAll();
  }
  @Get('company/:id')
  findByCompany(@Param('id') id: string) {
    return this.jobPostingService.findByCompany(+id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.jobPostingService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostingService.remove(+id);
  }
}
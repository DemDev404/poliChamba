import { Controller, Get, Delete, Param, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(+id);
  }

  @Get('jobs') 
  getAllJobs() {
      return this.appService.getAllJobPostings();
  }

  @Delete('jobs/:id')
  deleteJob(@Param('id') id: string) {
      return this.appService.deleteJobPosting(+id);
  }

  @Get('jobs/company/:id')
  getCompanyJobs(@Param('id') id: string) {
    return this.appService.getJobsByCompany(+id);
  }

  @Post('jobs/create')
  @HttpCode(HttpStatus.CREATED)
  async createJobPosting(@Body() jobData: any) {
    return this.appService.createJobPosting(jobData);
  }

  @Post('apply')
  applyToJob(@Body() body: { userId: number; jobId: number }) {
    return this.appService.createApplication(body.userId, body.jobId);
  }
}
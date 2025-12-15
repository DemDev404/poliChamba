import { Injectable, BadRequestException } from '@nestjs/common'; // Importa BadRequestException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JobPosting } from './job-posting.entity';
import { Application } from './application.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(JobPosting) private jobPostingRepository: Repository<JobPosting>,
    @InjectRepository(Application) private applicationRepository: Repository<Application>, 
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllUsers() {
    return this.userRepository.find({
      relations: ['role'], 
      order: { id: 'DESC' }
    });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  async getAllJobPostings() {
      return this.jobPostingRepository.find({
          relations: ['company'], 
          order: { postedAt: 'DESC' }
      });
  }

  async deleteJobPosting(id: number) {
      return this.jobPostingRepository.delete(id);
  }

  async getJobsByCompany(companyId: number) {
    return this.jobPostingRepository.find({
      where: { company: { id: companyId } },
      relations: ['applications', 'applications.user'], 
      order: { postedAt: 'DESC' }
    });
  }

  async createJobPosting(data: any) {
      const newJob = this.jobPostingRepository.create({
          ...data,
          company: { id: data.companyId }, 
      });
      return this.jobPostingRepository.save(newJob);
  }

  async createApplication(userId: number, jobId: number) {
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        user: { id: userId },
        jobPosting: { id: jobId }
      }
    });

    if (existingApplication) {
      throw new BadRequestException('Ya te has postulado a esta vacante anteriormente.');
    }

    const newApp = this.applicationRepository.create({
      user: { id: userId },
      jobPosting: { id: jobId },
      status: 'pending'
    });
    return this.applicationRepository.save(newApp);
  }
}
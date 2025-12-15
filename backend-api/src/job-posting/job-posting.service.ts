import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosting } from '../job-posting.entity';

@Injectable()
export class JobPostingService {
  constructor(
    @InjectRepository(JobPosting)
    private readonly jobPostingRepository: Repository<JobPosting>,
  ) {}

  async findAll(): Promise<JobPosting[]> {
    return this.jobPostingRepository.find({
      relations: ['company'], 
    });
  }
  async findByCompany(companyId: number): Promise<JobPosting[]> {
    return this.jobPostingRepository.find({
      where: { company: { id: companyId } },
      relations: ['applications', 'applications.user'], 
      order: { id: 'DESC' }
    });
  }

  async update(id: number, changes: Partial<JobPosting>): Promise<JobPosting> {
    const job = await this.jobPostingRepository.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`La oferta con ID ${id} no existe.`);
    }

    this.jobPostingRepository.merge(job, changes);
    return this.jobPostingRepository.save(job);
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobPostingRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`La oferta con ID ${id} no existe.`);
    }
  }
}
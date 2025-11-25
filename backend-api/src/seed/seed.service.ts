import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../role.entity';
import { Skill } from '../skill.entity';
import { Company } from '../company.entity';
import { User } from '../user.entity';
import { JobPosting } from '../job-posting.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(JobPosting)
    private readonly jobPostingRepository: Repository<JobPosting>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    console.log('🌱 Empezando el proceso de "seeding"...');

    console.log('Creando roles...');
    const candidateRole = this.roleRepository.create({ name: 'candidate' });
    const recruiterRole = this.roleRepository.create({ name: 'recruiter' });
    await this.roleRepository.save([candidateRole, recruiterRole]);

    console.log('Creando skills...');
    const skillsToCreate = [
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'TypeScript' },
      { name: 'SQL Server' },
      { name: 'UX/UI Design' },
    ];
    const skillEntities = this.skillRepository.create(skillsToCreate);
    await this.skillRepository.save(skillEntities);

    console.log('Creando compañías...');
    const company1 = this.companyRepository.create({
      name: 'Tech Solutions',
      description: 'Líderes en soluciones de software empresarial.',
      websiteUrl: 'https://techsolutions.com',
    });
    const company2 = this.companyRepository.create({
      name: 'Fintech Startup',
      description: 'Revolucionando las finanzas personales.',
      websiteUrl: 'https://fintechstartup.com',
    });
    const company3 = this.companyRepository.create({
      name: 'CreativeMinds',
      description: 'Agencia de diseño y branding.',
      websiteUrl: 'https://creativeminds.design',
    });
    await this.companyRepository.save([company1, company2, company3]);

    console.log('Creando anuncios de trabajo...');

    const jobsToCreate = [
      {
        title: 'Desarrollador Frontend React',
        description:
          '<h3>Responsabilidades</h3><ul><li>Desarrollar y mantener aplicaciones web con React.</li><li>Colaborar con diseñadores UX/UI.</li><li>Optimizar el rendimiento del frontend.</li></ul>',
        location: 'Ciudad de México (Remoto)',
        salary: 60000,
        jobType: 'Tiempo Completo',
        experienceLevel: 'Mid',
        company: company1,
      },
      {
        title: 'Ingeniero Backend (Node.js)',
        description:
          '<h3>Requisitos</h3><ul><li>+3 años de experiencia con Node.js y TypeScript.</li><li>Experiencia con bases de datos SQL (PostgreSQL, MS SQL).</li><li>Conocimiento de microservicios.</li></ul>',
        location: 'Guadalajara, Jalisco',
        salary: 70000,
        jobType: 'Tiempo Completo',
        experienceLevel: 'Senior',
        company: company2, 
      },
      {
        title: 'Diseñador de Producto UX/UI',
        description:
          '<h3>Sobre el Puesto</h3><p>Buscamos un diseñador apasionado por crear experiencias de usuario intuitivas y hermosas. Deberás presentar un portafolio robusto.</p>',
        location: 'Monterrey, Nuevo León',
        salary: 50000,
        jobType: 'Contrato',
        experienceLevel: 'Mid',
        company: company3,
      },
    ];

    const jobEntities = this.jobPostingRepository.create(jobsToCreate);
    await this.jobPostingRepository.save(jobEntities);

    console.log('✅ "Seeding" completado con éxito.');
  }
}
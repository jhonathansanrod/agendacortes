import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalService } from './professional.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfessionalService', () => {
  let service: ProfessionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionalService, PrismaService],
    }).compile();

    service = module.get<ProfessionalService>(ProfessionalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


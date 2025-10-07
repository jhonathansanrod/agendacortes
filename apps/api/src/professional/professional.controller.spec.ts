import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfessionalController', () => {
  let controller: ProfessionalController;
  let service: ProfessionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalController],
      providers: [ProfessionalService, PrismaService],
    }).compile();

    controller = module.get<ProfessionalController>(ProfessionalController);
    service = module.get<ProfessionalService>(ProfessionalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


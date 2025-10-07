import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const { name, timezone } = createOrganizationDto;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const existingOrg = await this.prisma.organization.findUnique({ where: { slug } });
    if (existingOrg) {
      throw new NotFoundException('Organization with this name already exists');
    }

    return this.prisma.organization.create({
      data: {
        name,
        slug,
        timezone,
      },
    });
  }

  async findPublicBySlug(slug: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        address: true,
        timezone: true,
        services: {
          where: { active: true },
          select: { id: true, name: true, durationMin: true, priceCents: true },
        },
        professionals: {
          where: { active: true },
          select: { id: true, user: { select: { name: true } }, bio: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with slug \"${slug}\" not found`);
    }

    return organization;
  }
}


import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, orgName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingOrg = await this.prisma.organization.findFirst({ where: { slug: orgName.toLowerCase().replace(/\s+/g, '-') } });
    if (existingOrg) {
      throw new BadRequestException('Organization with this name already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const organization = await this.prisma.organization.create({
      data: {
        name: orgName,
        slug: orgName.toLowerCase().replace(/\s+/g, '-'),
        timezone: 'America/Sao_Paulo', // Default timezone as per briefing
        users: {
          create: {
            name,
            email,
            passwordHash: hashedPassword,
            role: Role.ADMIN,
          },
        },
      },
    });

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("User not found after registration");
    }

    return this.generateJwtToken(user.id, user.email, user.role, organization.id);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const organization = await this.prisma.organization.findUnique({ where: { id: user.orgId } });
    if (!organization) {
      throw new UnauthorizedException("Organization not found for user");
    }

    return this.generateJwtToken(user.id, user.email, user.role, organization.id);
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private generateJwtToken(userId: string, email: string, role: Role, orgId: string) {
    const payload = { sub: userId, email, role, orgId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}


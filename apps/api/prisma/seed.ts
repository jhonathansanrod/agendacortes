import { PrismaClient, Role, AppointmentStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar organização de exemplo
  const organization = await prisma.organization.create({
    data: {
      name: 'Barbearia Central',
      slug: 'barbearia-central',
      logoUrl: 'https://via.placeholder.com/200x200?text=BC',
      address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      phone: '(11) 99999-9999',
      email: 'contato@barbeariacentral.com.br',
      website: 'https://barbeariacentral.com.br',
    },
  });

  console.log('✅ Organização criada:', organization.name);

  // Criar usuário admin
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'admin@barbeariacentral.com.br',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      orgId: organization.id,
      phone: '(11) 98888-8888',
    },
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar profissionais
  const professional1PasswordHash = await bcrypt.hash('pro123', 12);
  const professional1User = await prisma.user.create({
    data: {
      name: 'Carlos Barbeiro',
      email: 'carlos@barbeariacentral.com.br',
      passwordHash: professional1PasswordHash,
      role: Role.PRO,
      orgId: organization.id,
      phone: '(11) 97777-7777',
    },
  });

  const professional1 = await prisma.professional.create({
    data: {
      userId: professional1User.id,
      bio: 'Especialista em cortes clássicos e modernos, com mais de 10 anos de experiência.',
      specialties: ['Corte', 'Barba', 'Bigode'],
      active: true,
    },
  });

  const professional2PasswordHash = await bcrypt.hash('pro123', 12);
  const professional2User = await prisma.user.create({
    data: {
      name: 'André Costa',
      email: 'andre@barbeariacentral.com.br',
      passwordHash: professional2PasswordHash,
      role: Role.PRO,
      orgId: organization.id,
      phone: '(11) 96666-6666',
    },
  });

  const professional2 = await prisma.professional.create({
    data: {
      userId: professional2User.id,
      bio: 'Especialista em cortes modernos e design de sobrancelhas.',
      specialties: ['Corte', 'Sobrancelha', 'Relaxamento'],
      active: true,
    },
  });

  console.log('✅ Profissionais criados:', professional1User.name, professional2User.name);

  // Criar serviços
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte Simples',
        description: 'Corte de cabelo tradicional',
        durationMin: 30,
        priceCents: 2500, // R$ 25,00
        active: true,
        orgId: organization.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte + Barba',
        description: 'Corte de cabelo + barba completa',
        durationMin: 45,
        priceCents: 4500, // R$ 45,00
        active: true,
        orgId: organization.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Barba',
        description: 'Barba completa com navalha',
        durationMin: 20,
        priceCents: 2000, // R$ 20,00
        active: true,
        orgId: organization.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Sobrancelha',
        description: 'Design de sobrancelha masculina',
        durationMin: 15,
        priceCents: 1500, // R$ 15,00
        active: true,
        orgId: organization.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Relaxamento',
        description: 'Relaxamento capilar',
        durationMin: 60,
        priceCents: 8000, // R$ 80,00
        active: true,
        orgId: organization.id,
      },
    }),
  ]);

  console.log('✅ Serviços criados:', services.length);

  // Criar horários de trabalho para os profissionais
  const workingHours = [
    // Carlos - Segunda a Sexta
    ...Array.from({ length: 5 }, (_, i) => ({
      professionalId: professional1.id,
      dayOfWeek: i + 1, // 1 = Segunda, 5 = Sexta
      startTime: '08:00',
      endTime: '18:00',
      slotDurationMin: 30,
      active: true,
    })),
    // Carlos - Sábado
    {
      professionalId: professional1.id,
      dayOfWeek: 6, // Sábado
      startTime: '08:00',
      endTime: '14:00',
      slotDurationMin: 30,
      active: true,
    },
    // André - Segunda a Sexta
    ...Array.from({ length: 5 }, (_, i) => ({
      professionalId: professional2.id,
      dayOfWeek: i + 1,
      startTime: '09:00',
      endTime: '19:00',
      slotDurationMin: 30,
      active: true,
    })),
    // André - Sábado
    {
      professionalId: professional2.id,
      dayOfWeek: 6,
      startTime: '09:00',
      endTime: '15:00',
      slotDurationMin: 30,
      active: true,
    },
  ];

  await Promise.all(
    workingHours.map(data => prisma.workingHour.create({ data }))
  );

  console.log('✅ Horários de trabalho criados');

  // Criar alguns clientes de exemplo
  const clientPasswordHash = await bcrypt.hash('client123', 12);
  const clients = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Pedro Santos',
        email: 'pedro@email.com',
        passwordHash: clientPasswordHash,
        role: Role.CLIENT,
        orgId: organization.id,
        phone: '(11) 95555-5555',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Lucas Oliveira',
        email: 'lucas@email.com',
        passwordHash: clientPasswordHash,
        role: Role.CLIENT,
        orgId: organization.id,
        phone: '(11) 94444-4444',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Rafael Costa',
        email: 'rafael@email.com',
        passwordHash: clientPasswordHash,
        role: Role.CLIENT,
        orgId: organization.id,
        phone: '(11) 93333-3333',
      },
    }),
  ]);

  console.log('✅ Clientes criados:', clients.length);

  // Criar alguns agendamentos de exemplo
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(14, 0, 0, 0);

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        clientId: clients[0].id,
        professionalId: professional1.id,
        serviceId: services[1].id, // Corte + Barba
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 45 * 60000), // +45 min
        status: AppointmentStatus.CONFIRMED,
        notes: 'Cliente preferencial, corte baixo nas laterais',
      },
    }),
    prisma.appointment.create({
      data: {
        clientId: clients[1].id,
        professionalId: professional2.id,
        serviceId: services[0].id, // Corte Simples
        startTime: dayAfterTomorrow,
        endTime: new Date(dayAfterTomorrow.getTime() + 30 * 60000), // +30 min
        status: AppointmentStatus.PENDING,
        notes: 'Primeira vez na barbearia',
      },
    }),
  ]);

  console.log('✅ Agendamentos criados:', appointments.length);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log(`- Organização: ${organization.name}`);
  console.log(`- Admin: ${admin.email} (senha: admin123)`);
  console.log(`- Profissionais: ${professional1User.email}, ${professional2User.email} (senha: pro123)`);
  console.log(`- Clientes: ${clients.map(c => c.email).join(', ')} (senha: client123)`);
  console.log(`- Serviços: ${services.length}`);
  console.log(`- Agendamentos: ${appointments.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

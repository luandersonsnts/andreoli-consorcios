import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { users, simulations, complaints, jobApplications, consortiumSimulations } from '../shared/schema.pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = drizzle(sql);

async function seed() {
  try {
    console.log('Iniciando seed no banco da nuvem...');

    // Admin padrão (se não existir)
    const existingAdmin = await db.select().from(users).limit(1);
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.insert(users).values({
        id: randomUUID(),
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date()
      });
      console.log('Usuário admin criado: admin/admin123');
    }

    // Simulações (exemplo)
    await db.insert(simulations).values([
      {
        id: randomUUID(),
        name: 'Cliente A',
        phone: '(11) 99999-1111',
        email: 'cliente.a@example.com',
        objective: 'Aposentadoria',
        monthlyAmount: '1000',
        timeframe: '24 meses',
        whatsappSent: false,
        whatsappSentAt: null,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Cliente B',
        phone: '(11) 98888-2222',
        email: 'cliente.b@example.com',
        objective: 'Reserva financeira',
        monthlyAmount: '1500',
        timeframe: '36 meses',
        whatsappSent: false,
        whatsappSentAt: null,
        createdAt: new Date()
      }
    ]);

    // Reclamações (exemplo)
    await db.insert(complaints).values([
      {
        id: randomUUID(),
        name: 'Usuário X',
        email: 'x@example.com',
        phone: '(11) 97777-3333',
        type: 'Reclamação',
        subject: 'Atendimento',
        message: 'Demora no retorno',
        contactAuthorized: 'yes',
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Usuário Y',
        email: 'y@example.com',
        phone: '(11) 96666-4444',
        type: 'Elogio',
        subject: 'Equipe',
        message: 'Ótimo suporte',
        contactAuthorized: 'yes',
        createdAt: new Date()
      }
    ]);

    // Candidaturas (exemplo)
    await db.insert(jobApplications).values([
      {
        id: randomUUID(),
        name: 'Candidato 1',
        phone: '(11) 95555-5555',
        email: 'cand1@example.com',
        position: 'Consultor Comercial',
        linkedin: 'https://linkedin.com/in/cand1',
        resumeFilename: null,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Candidato 2',
        phone: '(11) 94444-6666',
        email: 'cand2@example.com',
        position: 'Analista de Marketing',
        linkedin: 'https://linkedin.com/in/cand2',
        resumeFilename: null,
        createdAt: new Date()
      }
    ]);

    // Simulações de consórcio (exemplo)
    await db.insert(consortiumSimulations).values([
      {
        name: 'Interessado 1',
        phone: '(11) 93333-7777',
        email: 'int1@example.com',
        category: 'Imóveis',
        groupId: 'GRP-IMOV-001',
        creditValue: '200000',
        useEmbedded: false,
        maxInstallmentValue: '1800',
        installmentCount: 120,
        whatsappSent: false,
        whatsappSentAt: null,
        createdAt: new Date()
      },
      {
        name: 'Interessado 2',
        phone: '(11) 92222-8888',
        email: 'int2@example.com',
        category: 'Veículos',
        groupId: 'GRP-AUTO-002',
        creditValue: '80000',
        useEmbedded: false,
        maxInstallmentValue: '950',
        installmentCount: 60,
        whatsappSent: false,
        whatsappSentAt: null,
        createdAt: new Date()
      }
    ]);

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  }
}

seed();
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { users } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = drizzle(sql);

async function initCloudDatabase() {
  try {
    console.log('Inicializando banco de dados na nuvem...');

    // Verificar se já existe um usuário admin
    const existingAdmin = await db.select().from(users).limit(1);
    
    if (existingAdmin.length === 0) {
      console.log('Criando usuário admin padrão...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.insert(users).values({
        id: randomUUID(),
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date()
      });
      
      console.log('Usuário admin criado com sucesso!');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('Usuário admin já existe no banco de dados.');
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

initCloudDatabase();
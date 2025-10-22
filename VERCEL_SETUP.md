# Configuração do Vercel para Site Full-Stack

Este guia explica como configurar o site para funcionar como uma aplicação full-stack no Vercel, com banco de dados e APIs funcionais.

## 1. Configuração do Banco de Dados

### Opção A: Vercel Postgres (Recomendado)

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para seu projeto
3. Clique na aba "Storage"
4. Clique em "Create Database" e selecione "Postgres"
5. Escolha um nome para o banco (ex: `andreoli-consorcios-db`)
6. Aguarde a criação do banco

### Opção B: PlanetScale (Alternativa)

1. Crie uma conta no [PlanetScale](https://planetscale.com)
2. Crie um novo banco de dados
3. Obtenha a string de conexão

## 2. Configuração das Variáveis de Ambiente

No Vercel Dashboard, vá para Settings > Environment Variables e adicione:

### Variáveis Obrigatórias:

```
POSTGRES_URL=postgres://username:password@hostname:port/database
POSTGRES_PRISMA_URL=postgres://username:password@hostname:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NO_SSL=postgres://username:password@hostname:port/database
POSTGRES_URL_NON_POOLING=postgres://username:password@hostname:port/database
POSTGRES_USER=username
POSTGRES_HOST=hostname
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

**Importante:** Se você usar Vercel Postgres, essas variáveis serão criadas automaticamente quando você conectar o banco ao projeto.

### Variáveis Opcionais:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 3. Inicialização do Banco de Dados

Após configurar as variáveis de ambiente:

1. Execute o script de inicialização:
```bash
npm run init-cloud-db
```

2. Ou execute manualmente:
```bash
npx tsx scripts/init-cloud-db.ts
```

Este script criará as tabelas necessárias e um usuário admin padrão.

## 4. Deploy

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente (passo 2)
3. O deploy será automático

### Comandos de Build:

- **Build Command:** `npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

## 5. Funcionalidades Disponíveis

Após o deploy, o site terá:

✅ **APIs Funcionais:**
- `/api/admin/login` - Login de administrador
- `/api/admin/stats` - Estatísticas do admin
- `/api/simulations` - Simulações de investimento
- `/api/consortium-simulations` - Simulações de consórcio
- `/api/complaints` - Manifestações
- `/api/job-applications` - Candidaturas

✅ **Painel Administrativo:**
- Login com autenticação JWT
- Visualização de simulações
- Estatísticas em tempo real

✅ **Fallback Automático:**
- Se as APIs não estiverem disponíveis, o site funciona em modo estático
- Redirecionamento automático para WhatsApp

## 6. Credenciais Padrão

**Admin padrão criado automaticamente:**
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANTE:** Altere a senha padrão após o primeiro login!

## 7. Monitoramento

- Acesse o Vercel Dashboard para ver logs das funções
- Monitore o uso do banco de dados na aba Storage
- Verifique erros na aba Functions

## 8. Desenvolvimento Local

Para testar localmente com o banco na nuvem:

1. Copie `.env.example` para `.env.local`
2. Configure as mesmas variáveis do Vercel
3. Execute: `npm run dev`

## 9. Troubleshooting

### Problema: APIs não funcionam
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o banco de dados está ativo
- Verifique os logs no Vercel Dashboard

### Problema: Erro de autenticação
- Verifique se `JWT_SECRET` está configurado
- Confirme se o usuário admin foi criado
- Tente fazer login com as credenciais padrão

### Problema: Banco de dados não conecta
- Verifique se todas as variáveis `POSTGRES_*` estão corretas
- Confirme se o banco está ativo no Vercel Storage
- Execute o script de inicialização novamente

## 10. Próximos Passos

Após o deploy bem-sucedido:

1. Altere a senha do admin padrão
2. Configure notificações por email (opcional)
3. Personalize as mensagens do WhatsApp
4. Configure domínio customizado (opcional)
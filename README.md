# AgendaCortes MVP

Este é o repositório do MVP do AgendaCortes, um SaaS multi-tenant para agendamento de barbearias e salões. O projeto é um monorepo contendo as aplicações frontend e backend, além de pacotes compartilhados.

## Visão Geral

O AgendaCortes é uma plataforma de agendamento online que permite a clientes agendar serviços com profissionais (barbeiros) em diferentes barbearias. Cada barbearia opera como um tenant independente, com seus próprios serviços, profissionais e configurações.

## Arquitetura e Pilha Tecnológica

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS, shadcn/ui
- **Formulários:** React Hook Form + Zod
- **Implantação:** Vercel

### Backend
- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Runtime:** Node.js 20
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Implantação:** Railway (Docker ou Node build)

### Banco de Dados
- **Tipo:** PostgreSQL
- **Provedor:** Railway

### Autenticação
- **Método:** Email/senha com JWT (HttpOnly cookies)
- **Reset de Senha:** Token assinado via email (Resend)

### E-mails
- **Serviço:** Resend (Postmark como fallback)
- **Templates:** MJML ou React Email

### Pagamentos
- **Serviço:** Stripe (Checkout Session)

### Jobs em Background
- **Serviço:** node-cron (para emails de lembrete)

### Infraestrutura
- **Frontend:** Vercel
- **Backend/API:** Railway
- **Banco de Dados:** Railway PostgreSQL
- **DNS/SSL/Proxy:** Cloudflare (domínio: agendacortes.com.br)

### Testes
- **Unitários:** Jest
- **API:** Supertest
- **E2E:** Playwright

### CI/CD
- **Plataforma:** GitHub Actions (lint, test, typecheck, deploy)

### Qualidade de Código
- ESLint, Prettier, TypeScript strict

## Layout do Repositório (Monorepo)

```
/agendacortes
  /apps
    /web        (Next.js frontend)
    /api        (NestJS backend)
  /packages
    /ui         (componentes de UI compartilhados, se necessário)
    /types      (tipos TypeScript e schemas Zod compartilhados)
  /.github/workflows
  docker-compose.dev.yml
  README.md
```

## Configuração de Desenvolvimento Local

### Pré-requisitos
- Node.js 20+
- pnpm
- Docker (opcional, para PostgreSQL local)

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd agendacortes
   ```

2. Instale as dependências do monorepo:
   ```bash
   pnpm i
   ```

3. Configure as variáveis de ambiente:
   Crie arquivos `.env` baseados nos exemplos fornecidos em `apps/api/.env.example` e `apps/web/.env.example`.

   **`apps/api/.env.example`**
   ```env
   NODE_ENV=production
   PORT=8080
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
   JWT_SECRET=change_me
   RESEND_API_KEY=...
   STRIPE_SECRET_KEY=...
   STRIPE_WEBHOOK_SECRET=...
   APP_BASE_URL=https://api.agendacortes.com.br
   FRONTEND_BASE_URL=https://app.agendacortes.com.br
   CRON_ENABLED=true
   TIMEZONE=America/Sao_Paulo
   ```

   **`apps/web/.env.example`**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.agendacortes.com.br/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   NEXT_PUBLIC_DEFAULT_TZ=America/Sao_Paulo
   ```

4. Inicie o banco de dados (opcional, para desenvolvimento local com Docker):
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. Execute as migrações do Prisma e o seed de dados:
   ```bash
   pnpm -C apps/api prisma migrate dev --name init
   pnpm -C apps/api seed
   ```

6. Inicie as aplicações em modo de desenvolvimento:
   ```bash
   pnpm dev
   ```

   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`

## Instruções de Implantação

### Domínio
- `agendacortes.com.br` (gerenciado via Cloudflare)

### Frontend (Vercel)
1. Crie um novo projeto no Vercel e conecte-o ao seu repositório GitHub.
2. Configure o diretório raiz do projeto para `/apps/web`.
3. Adicione as variáveis de ambiente conforme `apps/web/.env.example`.
4. Configure o domínio personalizado `app.agendacortes.com.br` para apontar para o Vercel.

### Backend (Railway)
1. Crie um novo projeto no Railway e conecte-o ao seu repositório GitHub.
2. Configure o diretório raiz do projeto para `/apps/api`.
3. Provisione um banco de dados PostgreSQL no Railway.
4. Configure as variáveis de ambiente conforme `apps/api/.env.example`, incluindo a `DATABASE_URL` fornecida pelo Railway.
5. Garanta que as migrações do Prisma sejam aplicadas no primeiro boot (configuração de build no Railway).
6. Configure o domínio personalizado `api.agendacortes.com.br` para apontar para o Railway.

### Cloudflare DNS
- Configure os seguintes registros CNAME/ALIAS:
  - `app.agendacortes.com.br` → Vercel target
  - `api.agendacortes.com.br` → Railway target
- **Stripe Webhook:** Crie uma regra no Cloudflare para ignorar o cache para `POST /api/v1/payments/webhook`.

## Configuração de Serviços Externos

### Stripe
1. Crie uma conta no Stripe.
2. Obtenha suas chaves `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Configure um webhook no Stripe para `https://api.agendacortes.com.br/api/v1/payments/webhook` e obtenha a `STRIPE_WEBHOOK_SECRET`.

### Resend
1. Crie uma conta no Resend.
2. Obtenha sua `RESEND_API_KEY`.
3. Configure um domínio de envio de e-mail verificado.

## Troubleshooting
- **Fusos Horários:** Todos os timestamps são armazenados em UTC e convertidos nas bordas da aplicação. Certifique-se de que `TIMEZONE` e `NEXT_PUBLIC_DEFAULT_TZ` estejam configurados corretamente.
- **CORS:** Verifique as configurações de CORS no backend se houver problemas de comunicação entre frontend e backend.
- **Cookies atrás do Cloudflare:** Garanta que as configurações de segurança do Cloudflare não interfiram nos cookies `HttpOnly` do JWT.

## Referências e Pesquisa

Durante o desenvolvimento, foram consultadas as seguintes referências para inspiração e melhores práticas:

- **Sistemas de Agendamento Open-Source:**
  - [Exemplo de sistema de agendamento com Next.js](https://github.com/example/barber-booking-nextjs)
  - [Exemplo de sistema de agendamento com NestJS e Prisma](https://github.com/example/salon-scheduling-nestjs-prisma)
- **Integração Stripe Checkout:**
  - [Documentação oficial do Stripe Checkout](https://stripe.com/docs/payments/checkout)
- **Templates de Email (Resend + React Email):**
  - [Exemplos de React Email](https://react.email/docs/examples)
- **Algoritmos de Disponibilidade:**
  - [Artigo sobre slotting de calendário](https://medium.com/swlh/building-a-calendar-scheduling-system-part-1-c9d2b7e0f8f)
- **Padrões shadcn/ui:**
  - [Documentação shadcn/ui](https://ui.shadcn.com/docs)
- **Boilerplates SaaS (Next.js App Router + Prisma):**
  - [Exemplo de boilerplate SaaS](https://github.com/example/nextjs-saas-boilerplate)

*Nota: Os links acima são exemplos e devem ser substituídos por referências reais encontradas durante a fase de pesquisa.*

# Note Moments

Sistema de gerenciamento de tarefas com API REST construído em Node.js, TypeScript e PostgreSQL.

## Características

- API REST completa para gerenciamento de tarefas
- Tipagem rigorosa com TypeScript
- Banco de dados PostgreSQL com Prisma ORM
- Arquitetura limpa com separação de camadas
- Validações de negócio robustas
- Sistema de prioridades (LOW, MEDIUM, HIGH)
- Filtros avançados (status, prioridade, tarefas em atraso)
- Estatísticas de tarefas

## Tecnologias

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de dados**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Desenvolvimento**: tsx (hot reload)

## Estrutura do Projeto

```
src/
├── controllers/     # Controle de requisições HTTP
├── services/        # Lógica de negócio
├── repositories/    # Acesso a dados
├── models/          # Validações e regras de negócio
├── types/           # Tipos TypeScript
├── routes/          # Definição de rotas
├── lib/             # Configurações (Prisma)
└── env/             # Variáveis de ambiente
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Welbert-Soares/note_moments.git
cd note_moments
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados no arquivo `.env`:
```env
PORT=3002
NODE_ENV=development
DATABASE_URL="sua-connection-string-postgresql"
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
```

5. Execute as migrações do banco:
```bash
npx prisma migrate dev
```

6. Gere o cliente Prisma:
```bash
npx prisma generate
```

## Executar o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

## API Endpoints

### Tarefas

- `GET /tasks` - Listar todas as tarefas
- `GET /tasks/:id` - Buscar tarefa por ID
- `POST /tasks` - Criar nova tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `PATCH /tasks/:id/complete` - Marcar como concluída
- `POST /tasks/:id/duplicate` - Duplicar tarefa

### Estatísticas

- `GET /tasks/stats/overview` - Estatísticas gerais

### Filtros Disponíveis

- `?completed=true|false` - Filtrar por status
- `?priority=LOW|MEDIUM|HIGH` - Filtrar por prioridade
- `?overdue=true` - Tarefas em atraso

## Estrutura de Dados

### Task

```typescript
{
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: Date
  pixel_reward?: string
  createdAt: Date
  updatedAt: Date
}
```

## Exemplos de Uso

### Criar Tarefa

```http
POST /tasks
Content-Type: application/json

{
  "title": "Nova tarefa",
  "description": "Descrição da tarefa",
  "priority": "HIGH",
  "dueDate": "2025-09-20T00:00:00.000Z",
  "pixel_reward": "100 pontos"
}
```

### Atualizar Tarefa

```http
PUT /tasks/123
Content-Type: application/json

{
  "title": "Tarefa atualizada",
  "completed": true
}
```

### Filtrar Tarefas

```http
GET /tasks?completed=false&priority=HIGH
```

## Testes

Use o arquivo `client.http` incluído no projeto para testar os endpoints com a extensão REST Client do VS Code.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm test` - Executa os testes (não implementado)

## Banco de Dados

O projeto utiliza PostgreSQL com Prisma ORM. As migrações são gerenciadas automaticamente.

### Comandos Úteis

```bash
# Ver dados no Prisma Studio
npx prisma studio

# Reset do banco
npx prisma migrate reset

# Nova migração
npx prisma migrate dev --name nome-da-migração
```

## Regras de Negócio

- Título da tarefa é obrigatório (3-255 caracteres)
- Prioridade padrão é MEDIUM
- Tarefas completadas não podem ser deletadas
- Não é possível criar tarefas com títulos duplicados (se pendentes)
- Data de vencimento não pode ser no passado

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

ISC
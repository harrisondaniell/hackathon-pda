# ClassH API

Esta API fornece um backend para gerenciamento e classificação de hospedagens, incluindo recursos como autenticação de usuários, filtragem de hotéis e muito mais. Segue uma arquitetura flexível e com injeção de dependência para garantir escalabilidade e manutenibilidade.

## Funcionalidades

- Classificação de Hospedagens através de um serviço de AI
- Autenticação e autorização de usuários usando JWT
- Operações CRUD para hotéis com campos de dados detalhados
- Filtros para busca de hotéis baseados em bairros, estrelas e nomes
- Injeção de dependência para gerenciamento flexível de serviços
- Prisma ORM para interação com banco de dados

## Instalação

Siga estes passos para configurar a API localmente:

### Pré-requisitos

- Node.js (v18.x ou superior)
- PostgreSQL
- npm ou yarn

### Passos

1. **Clone o Repositório**

   ```bash
   git clone git@github.com:harrisondaniell/hackathon-pda.git
   cd hotel-api
   ```

2. **Instale as Dependências**

   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

   ```env
   DATABASE_URL=sua_string_conexao_postgresql
   JWT_SECRET=seu_segredo_jwt
   FRONT_URL=http://localhost:3000
   NODE_ENV=dev (production, test)
   ```

4. **Execute as Migrações**

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o Servidor em ambiente de desenvolvimento**
   ```bash
   npm run dev
   ```
   O servidor rodará em `http://localhost:3000` por padrão.

## Rotas da API

### Rotas de Usuário

| Método | Rota                  | Descrição             |
| ------ | --------------------- | --------------------- |
| POST   | `/user/register`      | Registra novo usuário |
| POST   | `/user/login`         | Realiza login         |
| GET    | `/user/token/refresh` | Atualiza token JWT    |

### Rotas de Hotel

| Método | Rota             | Descrição                |
| ------ | ---------------- | ------------------------ |
| GET    | `/hotels`        | Lista todos os hotéis    |
| GET    | `/hotels/filter` | Lista hotéis com filtros |
| POST   | `/hotels`        | Adiciona novo hotel      |
| PUT    | `/hotels/:id`    | Atualiza hotel existente |
| DELETE | `/hotels/:id`    | Remove hotel             |

### Filtros Disponíveis

Use query parameters para filtrar hotéis:

- `neighborhood`: Filtra por bairro
- `favorites`: Boolean para filtrar apenas favoritos
- `name`: Filtra por nome do hotel

Exemplo:

```http
GET /hotels/filter?neighborhood=Centro&favorites=true&name=Luxo
```

## Arquitetura

A API está estruturada nas seguintes camadas:

- **Controllers**: Manipulam requisições e respostas HTTP
- **Use Cases**: Lógica de negócio e operações
- **Repositories**: Camada de acesso a dados (usando Prisma ORM)
- **Middleware**: Gerencia autenticação (JWT), COOKIES e outras tarefas intermediárias

### Injeção de Dependência

A API utiliza injeção de dependência para desacoplar a lógica e melhorar a testabilidade. Repositories e UseCases são injetados nos controllers:

```javascript
import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { RegisterUseCase } from "../use-cases/register.js";

const prismaUsersRepository = new PrismaUsersRepository();
const registerUseCase = new RegisterUseCase(prismaUsersRepository);
```

## Configuração CORS

```javascript
const corsOptions = {
  origin: ["http://localhost:3000", process.env.FRONT_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
```

## Segurança

- Autenticação baseada em JWT para rotas protegidas
- Token armazenado nos cookies protegido por httpOnly
- Dados sensíveis como senhas são hasheados usando bcrypt
- Rate limiting para prevenir ataques de força bruta
- Validação de dados de entrada

## Contribuição

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

# Marketplace

Um sistema de marketplace completo desenvolvido com Node.js, Express e SQLite, permitindo que vendedores cadastrem e gerenciem produtos, e que compradores possam navegar e realizar compras.

## Funcionalidades

- Autenticação de usuários (login/registro)
- Perfis de usuário com diferentes níveis de acesso (admin, vendedor, comprador)
- Catálogo de produtos com categorias
- Sistema de busca e filtros
- Carrinho de compras
- Processamento de pedidos
- Upload de imagens para produtos
- Painel administrativo

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: SQLite (Sequelize ORM)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/marketplace.git
cd marketplace
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o servidor
```bash
npm start
```

4. Acesse o aplicativo no navegador
```
http://localhost:3001
```

## Estrutura do Projeto

```
marketplace/
├── public/            # Arquivos estáticos (frontend)
│   ├── css/           # Folhas de estilo
│   ├── js/            # JavaScript do cliente
│   └── images/        # Imagens e uploads
├── src/
│   ├── config/        # Configurações (banco de dados, etc)
│   ├── controllers/   # Controladores da aplicação
│   ├── middleware/    # Middlewares Express
│   ├── models/        # Modelos de dados
│   │   └── sequelize/ # Modelos Sequelize
│   ├── routes/        # Definição de rotas da API
│   └── utils/         # Utilitários
└── server.js          # Ponto de entrada da aplicação
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter detalhes de um produto
- `POST /api/products` - Criar um produto (requer autenticação de vendedor)
- `PUT /api/products/:id` - Atualizar um produto
- `DELETE /api/products/:id` - Excluir um produto

### Pedidos
- `POST /api/orders` - Criar um pedido
- `GET /api/orders` - Listar todos os pedidos (admin)
- `GET /api/orders/myorders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter detalhes de um pedido

## Licença

Este projeto está licenciado sob a licença MIT.

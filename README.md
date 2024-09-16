# Desafio Orla - Frontend

Este é o frontend do projeto **Desafio Orla**, desenvolvido em React, que integra com uma API RESTful no backend para gerenciar projetos e funcionários.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para criação de interfaces de usuário.
- **Material-UI**: Biblioteca de componentes React com design moderno e responsivo.
- **CSS3**: Usado para customização do design e estilo do site.
- **Axios**: Biblioteca para realizar requisições HTTP ao backend.

## Funcionalidades

- **Página Inicial**: Uma página de boas-vindas com links para acessar as páginas de funcionários e projetos.
  
- **Página de Funcionários**:
  - Listagem de todos os funcionários cadastrados.
  - Criação de novos funcionários.
  - Edição e exclusão de funcionários existentes.
  - Associação de funcionários a projetos.
  - Visualização dos projetos associados a cada funcionário.

- **Página de Projetos**:
  - Listagem de todos os projetos cadastrados.
  - Criação de novos projetos.
  - Edição e exclusão de projetos existentes.
  - Associação de projetos a funcionários.
  - Visualização dos funcionários associados a cada projeto.

## Instalação

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/desafio-orla-frontend.git
```

2. **Navegue até o diretório do projeto:**

```bash
cd desafio-orla-frontend
```

3. **Instale as dependências:**

```bash
npm install
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm start
```

O frontend será iniciado em http://localhost:3000.

## Configuração

### Conexão com o Backend

Certifique-se de que o backend da API esteja rodando em [http://localhost:8080](http://localhost:8080). O serviço Axios, localizado em `src/services/api.js`, já está configurado para apontar para essa URL. Caso necessário, ajuste a `baseURL` conforme o ambiente:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do backend
});

export default api;
```

### Estilo e Design

O design do frontend foi desenvolvido utilizando **CSS personalizado** e a biblioteca **Material-UI** para criar uma interface moderna e totalmente responsiva, garantindo uma boa experiência de uso em diferentes dispositivos.


# 📚 Biblioteca ADA

Sistema de gerenciamento de biblioteca desenvolvido com HTML, CSS e JavaScript puro. Este projeto foi criado para fins **educacionais** e demonstra conceitos básicos de desenvolvimento web, manipulação do DOM e armazenamento local de dados.

## 🎯 Funcionalidades

### Para Usuários Comuns
- **Visualização de livros disponíveis**: Os usuários podem ver apenas os livros que estão disponíveis para aluguel
- **Login e Registro**: Sistema de autenticação simples com validação de senha
- **Logout**: Sair da conta a qualquer momento

### Para Administradores
- **Gerenciamento completo de livros**:
  - ➕ Criar novos livros
  - ✏️ Editar livros existentes
  - 🗑️ Excluir livros
  - 📖 Alugar livros para usuários
  - ↩️ Devolver livros alugados

- **Visualização completa**: Administradores veem todos os livros (disponíveis e alugados), incluindo informações sobre locatários e datas de devolução

- **Gerenciamento completo de usuários**:
  - ➕ Criar novos usuários
  - ✏️ Editar usuários existentes (username e tipo de acesso)
  - 🗑️ Excluir usuários
  - 👥 Visualizar todos os usuários cadastrados
  - 🔢 Sistema de IDs automáticos para cada usuário

## 🚀 Como Abrir no Live Server

### Pré-requisitos
- Visual Studio Code (ou outro editor que suporte Live Server)
- Extensão Live Server instalada no VS Code

### Passos

1. **Abra o projeto no VS Code**
   - Abra a pasta do projeto no Visual Studio Code

2. **Instale a extensão Live Server** (se ainda não tiver)
   - Vá em Extensions (Ctrl+Shift+X)
   - Procure por "Live Server"
   - Instale a extensão de Ritwick Dey

3. **Inicie o Live Server**
   - Clique com o botão direito no arquivo `login.html`
   - Selecione "Open with Live Server"
   - Ou clique no botão "Go Live" na barra inferior do VS Code

4. **Acesse o sistema**
   - O navegador abrirá automaticamente na página de login
   - URL padrão: `http://127.0.0.1:5500/login.html`

## 🔐 Credenciais Padrão

### Administrador
- **Email**: `admin`
- **Senha**: `admin123`

### Usuário Comum
- Crie uma conta através da página de registro (`register.html`)

## 💾 Como os Dados São Armazenados

Este projeto utiliza o **localStorage** do navegador para armazenar todas as informações. O localStorage é uma API do navegador que permite salvar dados no formato chave-valor diretamente no navegador do usuário.


## 📁 Estrutura do Projeto

```
Biblioteca_ADA/
│
├── login.html          # Página de login
├── register.html       # Página de registro
├── library.html        # Página do usuário comum
├── admin.html          # Página do administrador (gerenciamento de livros)
├── adminUsers.html     # Página de gerenciamento de usuários
├── login.js            # Lógica de autenticação e registro
├── library.js          # Lógica de gerenciamento de livros
├── adminUsers.js       # Lógica de gerenciamento de usuários
└── style.css           # Estilos da aplicação
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e layout
- **JavaScript (Vanilla)**: Lógica e interatividade
- **localStorage**: Armazenamento de dados

## 📝 Funcionalidades Técnicas

- Sistema de autenticação com diferentes níveis de acesso
- CRUD completo de livros (Create, Read, Update, Delete)
- CRUD completo de usuários (Create, Read, Update, Delete)
- Sistema de aluguel com controle de datas
- Filtragem de livros por disponibilidade
- Modais para formulários e confirmações
- Validação de formulários

---

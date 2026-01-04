# 🏖️ OnVacation

OnVacation é um aplicativo mobile desenvolvido em **React Native + Expo + TypeScript**, com foco em experiência do usuário, arquitetura escalável, **offline-first** e separação rigorosa de responsabilidades.

O app gerencia solicitações de férias, aprovações e cadastro de colaboradores, atendendo diferentes perfis de usuário: **Colaborador**, **Gestor** e **Administrador**.

## 📱 Principais Funcionalidades

- ✅ **Offline-First**: Funciona completamente offline com sincronização automática
- ✅ **Sistema de Sincronização**: Fila de retry robusta para garantir eventual consistency
- ✅ **Design System Atômico**: Componentes reutilizáveis e consistentes
- ✅ **Clean Architecture**: Separação clara de responsabilidades e baixo acoplamento
- ✅ **Multi-perfil**: Diferentes fluxos e permissões para Colaborador, Gestor e Admin

🎯 Objetivo do Projeto

Demonstrar domínio técnico em:

Arquitetura moderna e bem definida

Paradigma funcional

Isolamento de dependências externas

Gerenciamento de estado previsível

Persistência local e suporte offline

Código limpo, testável e escalável

## 🧠 Princípios Arquiteturais

- **Clean Architecture** adaptada para Mobile
- **Paradigma funcional** como padrão
- **Offline-first** como premissa fundamental
- **Feature-based architecture** para isolamento de domínios
- **Baixo acoplamento e alta coesão**
- **Dependências sempre apontando para dentro** (domain)
- **Atomic Design** para design system escalável

## 🏗️ Arquitetura Geral

```
src/
├── app/              # Providers, rotas e bootstrap da aplicação
├── core/             # Código compartilhado e infraestrutura global
│   ├── design-system/    # Atomic Design System completo
│   ├── facades/          # Abstração de bibliotecas externas
│   ├── offline/          # Sistema de sincronização offline-first
│   ├── services/         # Serviços globais (Supabase, SQLite)
│   └── utils/            # Helpers puros e reutilizáveis
└── features/         # Funcionalidades organizadas por domínio
    ├── auth/
    ├── collaborator/
    ├── manager/
    └── admin/
```

## 🧩 Core Layer

O core concentra tudo que é transversal ao sistema.

### Design System (Atomic Design)

Sistema de design completo seguindo metodologia **Atomic Design**:

- **Atoms**: Componentes básicos (Button, Input, Text, Icon, Avatar, Badge, Spacer, SafeArea, TabIcon, ProfileTag)
- **Molecules**: Combinações de atoms (Card, FormField, Dialog, Toast, StatusPill, FilterList, TeamRequestListItem)
- **Organisms**: Componentes complexos (ScreenContainer, Form, EmptyState, ProfileHeader, BottomTabBar, ApprovalActionBar)
- **Tokens**: Valores primitivos (cores, tipografia, espaçamento, radius, shadows)

Cada componente possui estrutura padronizada:
- `ComponentName.tsx` - Implementação
- `types.ts` - Tipos TypeScript
- `styles.ts` - Estilos (quando necessário)
- `index.ts` - Exportação pública

### Facades

**Abstração seletiva de bibliotecas externas**

**Decisão arquitetural:** Não todas as bibliotecas foram abstraídas em facades - isso seria muito trabalhoso e custoso em tempo. Apenas algumas foram abstraídas como **demonstração de como poderia ser feito** para todas as libs.

**Facades implementadas:**
- `storage.facade.ts` → AsyncStorage
- `database.facade.ts` → Abstração de banco de dados
- `sqlite.facade.ts` → SQLite específico
- `HttpFacade.ts` → Requisições HTTP

**Bibliotecas usadas diretamente:**
- `@react-navigation`, `@supabase`, `@react-native-community/netinfo`, `zustand`, `flash-list`, etc.

**Benefícios quando aplicado:**
- Permite trocar qualquer biblioteca alterando apenas o arquivo de facade
- Facilita testes com mocks
- Isola dependências externas do domínio
- Reduz acoplamento com bibliotecas específicas

### Sistema Offline-First e Sincronização

Sistema completo de sincronização offline-first com fila de retry robusta.

#### Arquitetura

**Componentes principais:**

1. **`SyncQueue`**: API para enfileirar ações pendentes
   - Verifica conectividade antes de processar
   - Dispara sincronização imediata se online (fire-and-forget)

2. **`SyncWorker`**: Worker que processa a fila de forma inteligente
   - Verifica conectividade e sessão antes de processar
   - Processa itens em ordem cronológica (FIFO)
   - Retry até 5 tentativas por item
   - Trata erros de forma robusta (conexão perdida, sessão inválida, etc.)

3. **`QueueRepository`**: Gerencia fila no SQLite
   - Armazena ações pendentes localmente
   - Suporta status: `pending`, `processing`, `failed`, `completed`

4. **`SyncProvider`**: Provider React que orquestra sincronização
   - Processa fila ao montar (se houver sessão)
   - Monitora mudanças de rede
   - Escuta eventos de autenticação
   - Dispara sincronização automática

#### Tipos de Ação Suportados

- `CREATE_VACATION_REQUEST`: Cria solicitação de férias (com idempotência)
- `APPROVE_REQUEST`: Aprova solicitação (Manager/Admin)
- `REJECT_REQUEST`: Rejeita solicitação (Manager/Admin)
- `APPROVE_USER`: Aprova cadastro de usuário (Admin)
- `REJECT_USER`: Rejeita cadastro de usuário (Admin)
- `UPDATE_USER_STATUS`: Atualiza status de usuário (Admin)

#### Estratégia Offline-First

**Operações de Leitura:**
```
Se online:
  → Busca dados remotos
  → Atualiza cache local com dados remotos
  → Retorna dados locais (garante consistência)
Se offline:
  → Retorna dados do cache local
```

**Operações de Escrita:**
```
1. Salva localmente imediatamente (optimistic UI)
2. Se online:
   → Tenta criar/atualizar no remoto
   → Se sucesso: Atualiza local com dados remotos (timestamps corretos)
   → Se falha: Enfileira para retry
3. Se offline:
   → Enfileira para retry automático quando reconectar
```

**Processamento da Fila:**
```
Quando online e com sessão válida:
  → Busca itens pendentes/falhados (FIFO)
  → Para cada item:
    → Tenta executar ação remota
    → Se sucesso: Remove da fila
    → Se falha:
      → Se perdeu conexão/sessão: Mantém pending
      → Se erro real: Incrementa retry
      → Após 5 tentativas: Marca como failed
```

**Características:**
- ✅ Resolução de conflitos usando timestamps (`updated_at`)
- ✅ Idempotência para evitar duplicatas
- ✅ UX otimista: atualizações aparecem imediatamente
- ✅ Sincronização automática quando conexão é restaurada
- ✅ Resiliente a falhas temporárias

## 🧠 Gerenciamento de Estado

Utilizamos **Zustand** como gerenciador de estado.

### Organização

- **Não existe `core/state`** - Estado é gerenciado nas próprias features
- Cada feature possui seus próprios stores em `presentation/store/`
- Exemplos: `useAuthStore`, `useVacationStore`, `useManagerStore`, `useAdminStore`
- Store global offline: `core/offline/store.ts` (isOnline, isSyncing, pendingCount)

### Por quê Zustand?

- ✅ **API simples e funcional**: Menos boilerplate que Redux
- ✅ **Excelente performance**: Otimizações automáticas
- ✅ **Fácil integração**: Hooks nativos e testes simples
- ✅ **Paradigma funcional**: Se encaixa perfeitamente com nossa arquitetura
- ✅ **Não verboso**: Código limpo e direto

### Uso do Estado

- Apenas estado realmente compartilhado vai para stores
- Estado local permanece nos componentes
- Stores integram use cases, não lógica de negócio direta

## 💾 Persistência & Offline-First

### Tecnologias

- **AsyncStorage**: Dados simples e chave-valor (sessão, preferências)
- **SQLite (expo-sqlite)**: Dados estruturados e históricos para uso offline

### Tabelas SQLite Locais

- `sync_queue`: Fila de ações pendentes para sincronização
- `auth_session`: Cache de sessão de autenticação
- `vacation_requests`: Cache de solicitações de férias (com campos derivados `requester_name`, `requester_avatar`)
- `admin_reports`: Cache de relatórios do admin
- `admin_pending_users`: Cache de usuários pendentes
- `admin_users`: Cache de usuários ativos

### Por quê essa abordagem?

- ✅ Permite funcionamento completo sem conexão
- ✅ Melhora UX em ambientes instáveis
- ✅ Sincronização automática e inteligente
- ✅ Cache local para melhor performance
- ✅ Eventual consistency garantida

## 🧱 Estrutura de Features

Cada feature é autônoma, seguindo Clean Architecture com separação clara entre camadas.

```
features/<feature-name>/
├── data/
│   ├── datasources/
│   │   ├── local/      # Fontes de dados locais (SQLite, AsyncStorage)
│   │   └── remote/     # Fontes de dados remotas (APIs - Supabase)
│   ├── mappers/        # Conversão DTO ↔ Entity
│   └── repositories/   # Implementações concretas dos repositórios
│
├── domain/
│   ├── entities/       # Entidades do domínio
│   ├── types/          # Contratos e interfaces (Repository, etc.)
│   ├── schemas/        # Schemas de validação (Zod)
│   ├── rules/          # Regras de negócio puras (opcional)
│   └── useCases/       # Casos de uso como funções puras
│
├── presentation/
│   ├── screens/        # Telas da feature
│   ├── components/     # Componentes específicos da feature
│   └── store/          # Stores Zustand específicas da feature
│
├── tests/              # Testes da feature
└── index.ts            # Exportações públicas
```

### Features Implementadas

- **`auth`**: Autenticação e gerenciamento de sessão
- **`collaborator`**: Funcionalidades do colaborador (solicitar férias, perfil, histórico)
- **`manager`**: Funcionalidades do gestor (aprovações, equipe)
- **`admin`**: Funcionalidades do administrador (gerenciamento de usuários, relatórios)

### Por quê essa estrutura?

- ✅ **Facilita manutenção**: Código organizado e previsível
- ✅ **Evita dependências cruzadas**: Cada feature é independente
- ✅ **Permite evolução independente**: Features podem evoluir separadamente
- ✅ **Facilita testes unitários**: Separação clara entre camadas
- ✅ **Paradigma funcional**: Use cases como funções puras com Dependency Injection

## 👥 Perfis de Usuário e Fluxos

### ⚠️ Observação sobre Cadastro de Usuários

O cadastro de novos usuários **não foi implementado na UI do aplicativo**. Os usuários são injetados diretamente no banco de dados (Supabase) via scripts SQL. Esta decisão foi tomada considerando que:

- O cadastro inicial de usuários é tipicamente feito por administradores do sistema
- A inserção via SQL permite maior controle e validação dos dados
- Simplifica o fluxo da aplicação focando nas funcionalidades principais

Administradores podem gerenciar usuários existentes (ativar/desativar, visualizar, aprovar cadastros pendentes) através da interface, mas a criação inicial é feita diretamente no banco de dados.

### 🔵 Perfil: Colaborador

**Tabs:** Início | Minhas Férias | Perfil

**Funcionalidades:**
- **Home**: 
  - Visualiza perfil e solicitações recentes
  - Botão para solicitar novas férias
  - ProfileTag com animação shimmer
  - Pull-to-refresh
  
- **Solicitar Férias**:
  - Formulário completo (título, datas, observações)
  - Validação de datas
  - Criação offline-first

- **Minhas Férias**:
  - Lista todas as solicitações
  - Filtros: Todos, Pendentes, Aprovadas, Reprovadas
  - FlashList para performance
  - Detalhes de cada solicitação
  - Atualização em tempo real via Supabase Realtime

### 🟢 Perfil: Gestor (Manager)

**Tabs:** Início | Solicitações | Perfil

**Funcionalidades:**
- **Home**:
  - Visualiza perfil e solicitações pendentes recentes
  - ProfileTag com animação shimmer
  - Pull-to-refresh

- **Solicitações da Equipe**:
  - Lista todas as solicitações da equipe
  - Filtros: Todas, Pendentes, Aprovadas, Reprovadas
  - Infinite scroll (10 itens por página)
  - Pull-to-refresh
  - Atualização em tempo real

- **Análise de Solicitação**:
  - Detalhes completos da solicitação
  - Barra de ações: Aprovar / Reprovar
  - Aprovação/rejeição offline-first:
    - Atualiza local imediatamente (optimistic update)
    - Sincroniza com remoto em background
    - Enfileira se offline ou se remoto falhar

### 🟣 Perfil: Administrador (Admin)

**Tabs:** Início | Usuários | Relatórios | Perfil

**Funcionalidades:**
- **Home (Dashboard)**:
  - Métricas principais (cadastros pendentes, totais, etc.)
  - Lista de novos membros
  - ProfileTag com animação shimmer
  - Pull-to-refresh

- **Cadastros Pendentes**:
  - Lista usuários aguardando aprovação
  - Detalhes completos do cadastro
  - Aprovar / Reprovar
  - Dialog customizado (substitui Alert.alert)
  - Aprovação/rejeição offline-first

- **Usuários Ativos**:
  - Lista todos os usuários do sistema
  - Filtros por role: Todos, Colaboradores, Gestores
  - Busca por nome/email
  - Detalhes do usuário:
    - Visualizar solicitações do usuário
    - Ativar/Desativar usuário
    - Alterar perfil

- **Relatórios**:
  - Dashboard com métricas detalhadas
  - Solicitações: Total, Aprovadas, Pendentes, Reprovadas
  - Usuários: Total colaboradores, Total gestores
  - Este Mês: Novas solicitações, Aprovadas, Novos cadastros
  - Atualização em tempo real via Supabase Realtime

### Características Comuns

- ✅ **Bottom Tab Bar** customizada com cores temáticas por perfil
- ✅ **Headers** customizados usando componentes do design system
- ✅ **Pull-to-refresh** em listas principais
- ✅ **Atualização automática** ao focar nas telas (`useFocusEffect`)
- ✅ **Supabase Realtime** para atualizações em tempo real
- ✅ **Offline-first**: Todas as ações funcionam offline

## 🧪 Testes

### Ferramentas

- **Jest**: Framework de testes
- **@testing-library/react-native**: Testes de componentes React Native

### Estratégia

**Foco em:**
- ✅ **UseCases**: Testes unitários puros (fácil devido ao paradigma funcional)
- ✅ **Repositórios**: Testes de integração com mocks de datasources
- ✅ **Regras de domínio**: Testes isolados de lógica de negócio
- ✅ **Facades**: Testes com mocks de bibliotecas externas
- ✅ **Persistência**: Testes isolados com banco em memória

**Features com testes de integração:**
- `collaborator/tests/`
- `manager/tests/`
- `admin/tests/`

**Decisão:** Priorizar testes de regras de negócio. Use cases são fáceis de testar por serem funções puras. A UI permanece simples e desacoplada da lógica.

🚀 Setup do Projeto
Pré-requisitos

Node.js (LTS)

Expo CLI

npm

Instalação
npm install

Rodar o projeto
npx expo start

🧰 Scripts Disponíveis
npm run start     # Inicia o Expo
npm run lint      # Executa ESLint
npm run test      # Executa testes

## 📐 Padrões de Código

- ✅ **TypeScript estrito**: Type safety em todo o código
- ✅ **Funções puras** sempre que possível
- ✅ **Sem classes** para lógica de negócio (paradigma funcional)
- ✅ **UI desacoplada** de regras de negócio
- ✅ **Imports sempre por índice** (index.ts) - barrel exports
- ✅ **Atomic Design** para componentes
- ✅ **Clean Architecture** com separação de camadas
- ✅ **Dependency Injection** por composição em use cases
- ✅ **Offline-first** em todas as operações
- ✅ **Optimistic UI** para melhor UX

## 🧭 Tecnologias Utilizadas

- **React Native** + **Expo**: Framework mobile
- **TypeScript**: Type safety
- **Supabase**: Backend (Auth, Database, Realtime)
- **SQLite (expo-sqlite)**: Banco de dados local
- **Zustand**: Gerenciamento de estado
- **React Navigation**: Navegação
- **FlashList**: Listas performáticas
- **Material Community Icons**: Ícones
- **Jest**: Testes
- **ESLint**: Linting

## 📚 Documentação

- **[Arquitetura Detalhada](./docs/architecture/architecture.md)**: Documentação completa da arquitetura do sistema
- **[Esquema do Banco de Dados](./docs/database_schema_collaborator.md)**: Esquema detalhado do banco de dados

## 🧭 Evolução Futura

- ✅ ~~Sincronização online/offline~~ (Implementado)
- ✅ ~~Cache inteligente~~ (Implementado)
- Feature flags
- Observabilidade (logs, analytics)
- Testes end-to-end
- Dark mode
- Internacionalização (i18n)
- Modularização por micro-features

👨‍💻 Autor

Maxson Coelho
Desenvolvedor Mobile & Frontend
Especialista em arquitetura, UX e sistemas escaláveis

🏁 Considerações Finais

Este projeto prioriza clareza arquitetural, qualidade de código e experiência do usuário, servindo como base sólida para aplicações reais em produção.
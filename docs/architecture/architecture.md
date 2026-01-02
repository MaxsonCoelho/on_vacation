# 🏗️ Arquitetura do Sistema

## Visão Geral

Este projeto adota uma **Clean Architecture orientada a Features**, com forte ênfase em paradigma funcional, **offline-first** e baixo acoplamento com bibliotecas externas. A arquitetura foi pensada para demonstrar maturidade técnica, clareza de decisões e facilidade de evolução.

A aplicação é organizada em três grandes blocos:

- **App** (Shell da aplicação) – composição, navegação e providers
- **Core** (infraestrutura e abstrações compartilhadas)
- **Features** (domínios de negócio isolados)

**Decisão:** usar Clean Architecture orientada a Features. **Por quê:** essa abordagem mantém o domínio protegido, facilita testes e permite escalar o produto sem refatorações estruturais.

## 🎯 Princípios Arquiteturais

- Organização por feature (feature-first)
- Dependências sempre apontam para dentro
- Domínio independente de UI e bibliotecas
- Paradigma funcional como padrão
- Efeitos colaterais isolados em camadas externas
- Offline-first como premissa
- Core como ponto único de abstração

**Decisão:** combinar Clean Architecture + funcional + offline-first. **Por quê:** reduz complexidade acidental e aproxima o projeto de cenários reais de produção.

## 📁 Estrutura Geral de Pastas

```
src/
├── app/
│   ├── navigation/
│   │   ├── collaborator/
│   │   ├── manager/
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── App.tsx
│   └── Main.tsx
│
├── core/
│   ├── design-system/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── tokens/
│   │   └── index.ts
│   ├── facades/
│   │   ├── storage.facade.ts
│   │   ├── database.facade.ts
│   │   ├── sqlite.facade.ts
│   │   └── HttpFacade.ts
│   ├── offline/
│   │   ├── connectivity/
│   │   ├── database/
│   │   ├── queue/
│   │   ├── sync/
│   │   ├── store.ts
│   │   └── SyncProvider.tsx
│   ├── services/
│   │   ├── sqlite.ts
│   │   └── supabase.ts
│   ├── types/
│   └── utils/
│
└── features/
    ├── auth/
    ├── collaborator/
    ├── manager/
    └── admin/
```

**Decisão:** separar App, Core e Features. **Por quê:** deixa responsabilidades explícitas e evita dependências cruzadas.

## 🧠 CORE — Camada de Infraestrutura e Abstrações

O Core concentra tudo que é transversal, reutilizável e independente das regras específicas de negócio.

### core/design-system

**Organização:** Atomic Design (Atoms, Molecules, Organisms)

- **Atoms:** Componentes básicos e indivisíveis (Button, Input, Text, Icon, Avatar, Badge, Spacer, SafeArea, TabIcon, etc.)
- **Molecules:** Combinações de atoms (Card, Alert, Dialog, Modal, FormField, Dropdown, Toast, StatusPill, etc.)
- **Organisms:** Componentes complexos que agrupam molecules (Form, EmptyState, ScreenContainer, ProfileHeader, BottomTabBar, etc.)
- **Tokens:** Design tokens (cores, tipografia, espaçamento, radius, shadows)

**Estrutura de componentes:** Cada componente possui sua própria pasta com:
- `ComponentName.tsx` - Implementação
- `types.ts` - Tipos TypeScript
- `styles.ts` - Estilos (quando necessário)
- `index.ts` - Exportação pública

**Decisão:** usar Atomic Design no Design System. **Por quê:** garante consistência visual, reutilização e escalabilidade. A estrutura modular facilita manutenção e evolução do sistema.

### core/facades

Responsável por abstrair bibliotecas externas em funções próprias do projeto.

**Características:**
- Cada biblioteca possui seu próprio arquivo de facade
- Exemplos:
  - `storage.facade.ts` → AsyncStorage
  - `database.facade.ts` → abstração de banco de dados
  - `sqlite.facade.ts` → SQLite específico
  - `HttpFacade.ts` → abstração de requisições HTTP (fetch)

**Decisão:** usar facades como camada de abstração de bibliotecas. **Por quê:** permite trocar qualquer biblioteca alterando apenas o arquivo de facade, sem impacto no domínio ou nas features.

### core/services

Responsável por configuração e instanciação de serviços externos.

**Serviços:**
- `supabase.ts` - Cliente Supabase configurado (auth, database, realtime)
- `sqlite.ts` - Configuração do SQLite

**Decisão:** centralizar configuração de serviços. **Por quê:** facilita manutenção, testes e permite configuração centralizada de ambiente (dev, staging, prod).

### core/offline

Sistema completo de sincronização offline-first.

**Componentes:**

#### offline/connectivity
- `NetworkMonitor.ts` - Monitora estado da conexão de rede

#### offline/database
- `connection.ts` - Gerencia conexão SQLite
- `schema.ts` - Define esquema de tabelas (sync_queue, auth_session, vacation_requests)
- `migrations.ts` - Sistema de migrações do banco

#### offline/queue
- `QueueEntity.ts` - Entidade que representa item da fila
- `QueueRepository.ts` - Repositório para gerenciar fila local
- `SyncQueue.ts` - API para enfileirar ações pendentes
- `SyncWorker.ts` - Worker que processa a fila

#### offline/sync
- `SyncEngine.ts` - Motor de sincronização
- `SyncStrategies.ts` - Estratégias específicas por tipo de ação

#### offline/store.ts
- Store Zustand para estado offline (isOnline, isSyncing, pendingCount)

#### offline/SyncProvider.tsx
- Provider React que:
  - Inicializa sincronização ao montar
  - Monitora mudanças de rede
  - Escuta eventos de autenticação
  - Dispara sincronização automática

**Estratégia:**
1. Ações são salvas localmente (optimistic UI)
2. Ações são enfileiradas na sync_queue
3. SyncWorker processa fila quando online
4. Estratégias específicas executam cada tipo de ação
5. Itens são removidos da fila após sucesso

**Decisão:** implementar sistema completo de sincronização offline. **Por quê:** garante experiência consistente mesmo sem conexão, com sincronização automática quando a rede volta.

### core/utils

Contém funções utilitárias puras:
- `date.ts` - Formatação e manipulação de datas
- `masks.ts` - Máscaras de formatação (CPF, telefone, etc.)
- `uuid.ts` - Geração de UUIDs

**Decisão:** permitir apenas funções puras. **Por quê:** melhora previsibilidade e testabilidade.

### core/types

Contém tipos globais e enums compartilhados (quando necessário).

**Decisão:** tipagem centralizada para tipos verdadeiramente globais. **Por quê:** melhora DX e reduz erros em tempo de desenvolvimento. A maioria dos tipos permanece dentro das features.

## 🧩 FEATURES — Domínios de Negócio

Cada feature representa um domínio isolado, seguindo o mesmo padrão estrutural.

### Estrutura padrão de uma Feature

```
features/<feature-name>/
├── data/
│   ├── datasources/
│   │   ├── local/      # Fontes de dados locais (SQLite, AsyncStorage)
│   │   └── remote/     # Fontes de dados remotas (APIs)
│   ├── mappers/        # Conversão DTO ↔ Entity
│   ├── repositories/   # Implementações concretas dos repositórios
│   └── strategies/     # Estratégias específicas (opcional)
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
│   ├── store/          # Stores Zustand específicas da feature
│   └── viewModel.ts    # ViewModels (quando necessário)
│
├── tests/              # Testes da feature
└── index.ts            # Exportações públicas
```

**Features atuais:**
- `auth` - Autenticação e gerenciamento de sessão
- `collaborator` - Funcionalidades do colaborador (solicitar férias, perfil, histórico)
- `manager` - Funcionalidades do gestor (aprovações, equipe)
- `admin` - Funcionalidades do administrador (gerenciamento de usuários)

**Decisão:** padronizar a estrutura das features. **Por quê:** facilita leitura, manutenção e onboarding.

### feature/data

**Responsável por:**
- Acesso a facades de persistência e serviços
- Mapeamento DTO ↔ Domain
- Implementação de repositórios concretos
- Datasources locais (SQLite/AsyncStorage) e remotos (API)

**Padrão Repository:**
- Contratos definidos em `domain/types/`
- Implementações em `data/repositories/`
- Repositórios combinam datasources locais e remotos
- Estratégia offline-first: salva local primeiro, sincroniza depois

**Decisão:** separar dados do negócio. **Por quê:** mudanças de persistência não afetam regras.

### feature/domain

**Responsável por:**
- Entidades do domínio (modelos de negócio)
- Regras específicas da feature
- Contratos de repositórios (interfaces)
- Schemas de validação (Zod)

**Decisão:** domínio isolado por feature. **Por quê:** mantém regras coesas e localizadas.

### feature/domain/useCases

**Responsável por:**
- Casos de uso como funções puras
- Dependências recebidas por composição (Dependency Injection)

**Exemplo conceitual:**
```typescript
const loginUseCase = (authRepository: AuthRepository) => 
  async (email: string, password: string) => {
    return await authRepository.login(email, password);
  };
```

**Uso:**
```typescript
const login = loginUseCase(authRepository);
const result = await login(email, password);
```

**Decisão:** use cases funcionais com injeção de dependência. **Por quê:** fluxo explícito, previsível e fácil de testar. Permite mockar dependências facilmente.

### feature/presentation

**Responsável por:**
- Screens (componentes de tela)
- Stores Zustand (estado global da feature)
- ViewModels (quando necessário para lógica de UI complexa)

**Padrão de Store:**
- Cada feature possui seus próprios stores (ex: `useAuthStore`, `useVacationStore`, `useManagerStore`)
- Stores integram use cases e repositórios
- Stores podem incluir lógica de sincronização e realtime

**Decisão:** UI sem regra de negócio. **Por quê:** evita duplicação e acoplamento. Estado local permanece nos componentes, estado compartilhado vai para stores.

## 🔄 Paradigma Funcional

**Práticas adotadas:**
- Funções puras como padrão
- Imutabilidade
- Composição ao invés de herança
- Efeitos colaterais isolados em facades e datasources
- Use cases como funções de primeira classe
- Injeção de dependência por composição

**Decisão:** priorizar paradigma funcional. **Por quê:** reduz complexidade e melhora a confiabilidade do código.

## 🧭 Navegação

**Local:** `app/navigation`

**Estrutura:**
- `AppNavigator.tsx` - Navegador raiz que decide fluxo baseado em autenticação e role
- `collaborator/` - Fluxo de navegação do colaborador
  - `CollaboratorNavigator.tsx` - Navigator principal
  - `stacks/` - Stacks específicos (HomeStack, ProfileStack, VacationStack)
- `manager/` - Fluxo de navegação do gestor
  - `ManagerNavigator.tsx` - Navigator principal
  - `stacks/` - Stacks específicos (ManagerHomeStack, ManagerProfileStack, ManagerRequestsStack)
- `types.ts` - Tipos TypeScript para navegação

**Fluxos separados por perfil:**
- Colaborador → `CollaboratorNavigator`
- Gestor → `ManagerNavigator`
- Administrador → Tela direta (`AdminHomeScreen`)

**Guards baseados em Role:**
- O `AppNavigator` verifica autenticação e role do usuário
- Redireciona para o fluxo apropriado automaticamente

**Decisão:** navegação fora das features. **Por quê:** navegação é infraestrutura, não domínio. Facilita gerenciamento de rotas e guards.

## 📦 Gerenciamento de Estado

**Ferramenta:** Zustand

**Organização:**
- **Não existe `core/state`** - Estado é gerenciado nas próprias features
- Cada feature possui seus próprios stores em `presentation/store/`
- Exemplos: `useAuthStore`, `useVacationStore`, `useManagerStore`, `useProfileStore`

**Store offline:**
- `core/offline/store.ts` - Estado global de sincronização (isOnline, isSyncing, pendingCount)

**Decisão:** usar Zustand para gerenciamento de estado. **Por quê:** é simples, performático, não verboso e se encaixa bem com paradigma funcional, evitando boilerplate desnecessário.

**Uso do estado:**
- Apenas estado realmente compartilhado vai para stores
- Estado local permanece nos componentes
- Stores integram use cases, não lógica de negócio direta

## 💾 Persistência & Offline-first

**Tecnologias:**
- **AsyncStorage:** dados simples e chave-valor (sessão, preferências)
- **SQLite (expo-sqlite):** dados estruturados e históricos (vacation_requests, auth_session, sync_queue)

**Estratégia:**
1. **Read:** Busca remoto, atualiza local, retorna local (fallback offline)
2. **Write:** Salva local primeiro (optimistic UI), enfileira para sincronização
3. **Sync:** Processa fila automaticamente quando online
4. **Realtime:** Supabase Realtime para atualizações em tempo real quando aplicável

**Tabelas SQLite:**
- `sync_queue` - Fila de ações pendentes
- `auth_session` - Sessão de autenticação
- `vacation_requests` - Solicitações de férias

**Decisão:** combinar AsyncStorage + SQLite. **Por quê:** AsyncStorage atende configurações simples, enquanto SQLite garante consistência e performance para dados complexos em modo offline.

## 🧪 Testes

**Estratégia:**
- **UseCases:** testes unitários puros (fácil devido ao paradigma funcional)
- **Facades:** testes com mocks
- **Repositories:** testes de integração com mocks de datasources
- **Persistência:** testes isolados com banco em memória

**Ferramentas:**
- Jest
- @testing-library/react-native

**Decisão:** priorizar testes de regras. **Por quê:** maior retorno de valor com menor esforço. Use cases são fáceis de testar por serem funções puras.

## 🏁 Conclusão

Esta arquitetura foi definida para:
- Demonstrar senioridade técnica
- Permitir troca de bibliotecas sem impacto estrutural
- Suportar offline-first de forma consistente e robusta
- Facilitar testes e manutenção
- Escalar o produto sem refatorações estruturais

Ela atende integralmente aos requisitos do desafio e reflete práticas utilizadas em aplicações reais de produção.

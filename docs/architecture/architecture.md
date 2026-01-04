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

O Design System segue rigorosamente a metodologia Atomic Design, criando uma hierarquia clara e reutilizável de componentes.

#### Filosofia do Atomic Design

**Princípio:** Componentes são organizados em níveis hierárquicos, do mais simples ao mais complexo, seguindo a analogia química:
- **Atoms** são os elementos básicos
- **Molecules** combinam atoms para formar funcionalidades
- **Organisms** combinam molecules para formar seções completas

#### Estrutura Hierárquica

**1. Atoms (Componentes Atômicos)**
Componentes básicos, indivisíveis e sem dependências de outros componentes do sistema. São os blocos fundamentais.

**Componentes Implementados:**
- `Text`: Componente de texto com variantes (h1, h2, h3, body, caption) e pesos (regular, medium, bold)
- `Button`: Botão com variantes (primary, secondary, outline) e estados (disabled, loading)
- `Input`: Campo de entrada de texto com validação
- `Icon`: Ícone vetorial (Material Community Icons) com suporte a cores e tamanhos
- `Avatar`: Avatar circular com suporte a imagem ou iniciais
- `Badge`: Badge para notificações e contadores
- `Spacer`: Componente para espaçamento consistente
- `SafeArea`: Wrapper para SafeAreaView
- `TabIcon`: Ícone customizado para tabs com estados (active/inactive)
- `ProfileTag`: Tag de perfil com animação shimmer (Colaborador, Gestor, Admin)

**Características:**
- Cada atom é autocontido e reutilizável
- Possuem props mínimas e bem definidas
- Não conhecem contexto de negócio
- Altamente testáveis e documentáveis

**2. Molecules (Moléculas)**
Combinações de atoms que formam componentes funcionais simples.

**Componentes Implementados:**
- `Card`: Container com padding e sombra, aceita children
- `FormField`: Combinação de Label + Input + Error message
- `Alert`: Alert customizado (substitui Alert.alert nativo)
- `Dialog`: Modal dialog customizado para confirmações
- `Toast`: Notificação toast para feedback de ações
- `Dropdown`: Menu dropdown para seleção
- `StatusPill`: Indicador visual de status (pending, approved, rejected)
- `FilterList`: Lista horizontal de filtros selecionáveis
- `TabItem`: Item de tab com ícone e label
- `TeamRequestListItem`: Item de lista de solicitações (reutilizado em Manager)
- `HeaderTitle`: Título customizado para headers
- `HeaderIconAction`: Ícone de ação no header
- `HeaderBackButton`: Botão de voltar customizado

**Características:**
- Combinam múltiplos atoms para criar funcionalidade
- Podem ter estado local quando necessário
- Ainda não conhecem contexto de negócio específico
- Fáceis de reutilizar em diferentes contextos

**3. Organisms (Organismos)**
Componentes complexos que combinam molecules para formar seções completas da interface.

**Componentes Implementados:**
- `ScreenContainer`: Container principal de tela com SafeArea, scroll, refresh control
- `Form`: Formulário completo com validação e submissão
- `EmptyState`: Estado vazio com ícone, título e ação opcional
- `ProfileHeader`: Header de perfil com avatar, nome, email e ações
- `BottomTabBar`: Barra de navegação inferior customizada
  - `GenericBottomTabBar`: Wrapper genérico para React Navigation
  - Suporta cores temáticas por perfil (collaborator, manager, admin)
- `ApprovalActionBar`: Barra de ações para aprovação/rejeição (Manager/Admin)
- `StatusSummary`: Resumo de status com contadores
- `ListSection`: Seção de lista com título e conteúdo

**Características:**
- Componentes mais complexos e contextuais
- Podem ter lógica de negócio relacionada à UI
- Reutilizáveis em contextos específicos
- Formam blocos de interface significativos

**4. Tokens (Design Tokens)**
Valores primitivos que definem o design system de forma consistente.

**Estrutura:**
```
tokens/
├── colors/
│   ├── primary, secondary, brand (collaborator, manager, admin)
│   ├── status (success, warning, error, info)
│   ├── text (primary, secondary, inverse)
│   └── background, surface, border
├── typography/
│   ├── fontSize (h1, h2, h3, body, caption)
│   ├── fontWeight (regular, medium, bold)
│   └── lineHeight
├── spacing/
│   └── xs, sm, md, lg, xl (escala consistente)
├── radius/
│   └── sm, md, lg, full
└── shadows/
    └── níveis de elevação
```

**Benefícios:**
- Consistência visual garantida
- Facilita temas e dark mode (futuro)
- Mudanças de design centralizadas
- Reduz erros de inconsistência

#### Estrutura de Componentes

Cada componente segue uma estrutura padronizada:

```
ComponentName/
├── ComponentName.tsx    # Implementação do componente
├── types.ts            # Tipos TypeScript e interfaces
├── styles.ts           # Estilos usando StyleSheet (quando necessário)
└── index.ts            # Exportação pública (barrel export)
```

**Vantagens desta estrutura:**
- Organização clara e previsível
- Fácil localização de código relacionado
- Facilita refatoração e manutenção
- Suporta testes isolados

#### Princípios de Uso

1. **Reutilização:** Componentes devem ser reutilizáveis, não duplicados
2. **Composição:** Componentes complexos são compostos de componentes simples
3. **Consistência:** Uso consistente de tokens e componentes
4. **Acessibilidade:** Componentes consideram acessibilidade (quando aplicável)
5. **Performance:** Componentes são otimizados (memo quando necessário)

#### Integração com Features

- Features **podem criar componentes específicos** em `features/<feature>/presentation/components/`
- Componentes específicos de feature devem seguir a estrutura do design system
- Exemplo: `VacationHistoryItem` em `features/collaborator/presentation/components/`

**Decisão:** Usar Atomic Design rigorosamente no Design System. **Por quê:** 
- Garante consistência visual em todo o aplicativo
- Facilita reutilização e manutenção
- Escalável: novos componentes se integram naturalmente
- Melhora DX (Developer Experience): desenvolvedores sabem onde encontrar componentes
- Facilita onboarding de novos membros da equipe
- Prepara o sistema para temas e personalização futura

### core/facades

Responsável por abstrair bibliotecas externas em funções próprias do projeto.

**Características:**
- Cada biblioteca possui seu próprio arquivo de facade
- Facades são uma camada de abstração que encapsula chamadas a bibliotecas externas
- Exemplos implementados:
  - `StorageFacade.ts` → Interface de abstração para operações de armazenamento
    - `AsyncStorageFacade.ts` → Implementação usando AsyncStorage
    - `SupabaseStorageAdapter.ts` → Adapter que adapta StorageFacade para formato esperado pelo Supabase Auth
  - `database.facade.ts` → abstração de banco de dados
  - `sqlite.facade.ts` → SQLite específico (operações de sessão e reset para testes)
  - `HttpFacade.ts` → abstração de requisições HTTP (fetch)

**StorageFacade Pattern:**
O projeto implementa um padrão de facade para abstração de storage:

1. **`StorageFacade` (Interface):**
   - Define contrato: `get(key)`, `set(key, value)`, `remove(key)`
   - Permite trocar implementação sem impactar código consumidor

2. **`AsyncStorageFacade` (Implementação):**
   - Implementa `StorageFacade` usando AsyncStorage
   - Isola AsyncStorage em um único ponto

3. **`SupabaseStorageAdapter` (Adapter):**
   - Adapta `StorageFacade` para formato esperado pelo Supabase Auth (`getItem`, `setItem`, `removeItem`)
   - Evita acoplar Supabase à interface interna da Facade
   - Mantém separação de responsabilidades

**Benefícios:**
- ✅ Nenhum import direto de `@react-native-async-storage/async-storage` fora do core
- ✅ Fácil migração futura para SecureStore sem refatorar código
- ✅ Isolamento de dependências externas
- ✅ Facilita testes com mocks

**Decisão Arquitetural:**
- **Não todas as bibliotecas foram abstraídas em facades** - isso seria muito trabalhoso e custoso em tempo
- Apenas algumas foram abstraídas como **demonstração de como poderia ser feito** para todas as libs
- Bibliotecas como `@react-navigation`, `@supabase`, `@react-native-community/netinfo`, `zustand`, `flash-list` são usadas diretamente onde necessário
- O padrão de facade é aplicado onde faz sentido estratégico (persistência, HTTP, storage)

**Por quê:** Demonstra conhecimento de padrões de design e preparação para evolução futura, sem comprometer prazos. Em um projeto maior, todas as libs críticas seriam abstraídas seguindo este padrão.

### core/services

Responsável por configuração e instanciação de serviços externos.

**Serviços:**
- `supabase.ts` - Cliente Supabase configurado (auth, database, realtime)
- `sqlite.ts` - Configuração do SQLite

**Decisão:** centralizar configuração de serviços. **Por quê:** facilita manutenção, testes e permite configuração centralizada de ambiente (dev, staging, prod).

### core/offline

Sistema completo de sincronização offline-first com fila de retry robusta.

**Arquitetura Offline-First:**

O sistema implementa uma estratégia offline-first completa, garantindo que o aplicativo funcione perfeitamente mesmo sem conexão, sincronizando automaticamente quando a rede é restaurada.

#### offline/connectivity
- **`NetworkMonitor.ts`**: Monitora estado da conexão de rede
  - Verifica estado inicial ao iniciar
  - Escuta mudanças de conectividade em tempo real
  - Dispara sincronização automaticamente quando conexão é restaurada
  - Integra com `SyncEngine` para processar fila ao detectar conexão

#### offline/database
- **`connection.ts`**: Gerencia conexão SQLite singleton
  - Garante uma única instância de banco em todo o app
  - Previne problemas de concorrência e vazamentos de memória
- **`schema.ts`**: Define esquema completo das tabelas
  - `sync_queue`: Fila de sincronização
  - `auth_session`: Sessão de autenticação
  - `vacation_requests`: Solicitações de férias (com campos cacheados)
  - `admin_reports`: Relatórios do admin (cache local)
  - `admin_pending_users`: Usuários pendentes (cache local)
  - `admin_users`: Usuários ativos (cache local)
- **`migrations.ts`**: Sistema de migrações versionado
  - Executa migrações automaticamente ao inicializar
  - Suporta adição de colunas novas em versões futuras

#### offline/queue

**Arquitetura da Fila de Retry:**

O sistema de fila é o coração da sincronização offline, garantindo que todas as operações sejam eventualmente sincronizadas.

**Componentes:**

1. **`QueueEntity.ts`**: Define a entidade de item da fila
   ```typescript
   interface QueueItem<T> {
     id: string;              // ID único do item
     type: string;            // Tipo da ação ('CREATE_VACATION_REQUEST', 'APPROVE_REQUEST', etc.)
     payload: T;              // Dados da ação
     createdAt: number;       // Timestamp de criação
     retryCount: number;      // Contador de tentativas
     status: SyncStatus;      // 'pending' | 'processing' | 'failed' | 'completed'
   }
   ```

2. **`QueueRepository.ts`**: Repositório para gerenciar fila no SQLite
   - `add()`: Adiciona item à fila
   - `getPending()`: Busca itens pendentes ou falhados (ordem cronológica)
   - `updateStatus()`: Atualiza status de um item
   - `incrementRetry()`: Incrementa contador de tentativas
   - `remove()`: Remove item processado com sucesso

3. **`SyncQueue.ts`**: API pública para enfileirar ações
   - `enqueue<T>(type, payload)`: Adiciona ação à fila
   - Verifica conectividade antes de tentar processar imediatamente
   - Se online, dispara `SyncWorker.processQueue()` em background (fire-and-forget)
   - Retorna item criado para rastreamento

4. **`SyncWorker.ts`**: Worker que processa a fila de forma inteligente

   **Processamento Inteligente:**
   - Verifica conectividade antes de processar
   - Aguarda sessão válida (retry até 3 vezes com delay de 300ms)
   - Processa itens em ordem cronológica (FIFO)
   - Para cada item:
     - Identifica tipo de ação via `switch`
     - Executa operação remota correspondente
     - Remove da fila em caso de sucesso
     - Em caso de erro:
       - Verifica se perdeu conexão/sessão → mantém como pending
       - Se erro real → incrementa retry count
       - Após 5 tentativas → marca como 'failed'
   
   **Tipos de Ação Suportados:**
   - `CREATE_VACATION_REQUEST`: Cria solicitação de férias
     - Implementa idempotência: trata erro de duplicata como sucesso
   - `APPROVE_REQUEST`: Aprova solicitação (Manager/Admin)
   - `REJECT_REQUEST`: Rejeita solicitação (Manager/Admin)
   - `APPROVE_USER`: Aprova cadastro de usuário (Admin)
   - `REJECT_USER`: Rejeita cadastro de usuário (Admin)
   - `UPDATE_USER_STATUS`: Atualiza status de usuário (Admin)
   - `UPDATE_PROFILE`: Atualiza perfil de usuário (Admin)
     - Permite alterar role e informações adicionais (departamento, cargo, telefone)

   **Robustez:**
   - Evita race conditions verificando conexão/sessão uma vez antes do loop
   - Processa itens restantes recursivamente após sucesso (com delay de 500ms)
   - Trata erros de forma silenciosa para não bloquear UI

#### offline/sync
- **`SyncEngine.ts`**: Motor de sincronização (legado, mantido para compatibilidade)
  - Alternativa ao SyncWorker, usa estratégias configuráveis
- **`SyncStrategies.ts`**: Mapeia tipos de ação para estratégias (não usado atualmente)

#### offline/store.ts
- Store Zustand global para estado offline
- Estado gerenciado:
  - `isOnline`: Status de conectividade
  - `isSyncing`: Flag indicando sincronização em andamento
  - `pendingCount`: Quantidade de itens pendentes na fila
- Ações: `setOnlineStatus()`, `setSyncing()`, `setPendingCount()`

#### offline/SyncProvider.tsx
Provider React que orquestra toda a sincronização:

**Inicialização:**
1. Processa fila ao montar (se houver sessão)
2. Configura listeners:
   - **NetworkMonitor**: Dispara sincronização ao detectar conexão
   - **Auth State**: Dispara sincronização ao fazer login ou refresh token

**Comportamento:**
- Sincronização automática e silenciosa
- Não bloqueia UI (operações em background)
- Processa fila sempre que conexão é restaurada

**Estratégia Offline-First Completa:**

1. **Operações de Leitura (Read):**
   ```
   Se online:
     → Busca dados remotos
     → Atualiza cache local com dados remotos
     → Retorna dados locais (garante consistência)
   Se offline:
     → Retorna dados do cache local
   ```

2. **Operações de Escrita (Write - Ex: Criar Solicitação):**
   ```
   1. Salva localmente imediatamente (optimistic UI)
   2. Se online:
      → Tenta criar no remoto
      → Se sucesso: Busca dados remotos e atualiza local (para garantir timestamps corretos)
      → Se falha: Enfileira para retry
   3. Se offline:
      → Enfileira para retry automático quando reconectar
   ```

3. **Operações de Atualização (Update - Ex: Aprovar Solicitação):**
   ```
   1. Atualiza localmente imediatamente (optimistic UI)
   2. Se online:
      → Tenta atualizar remoto em background (sem await)
      → Se sucesso: Processa fila
      → Se falha: Enfileira para retry
   3. Se offline:
      → Enfileira para retry automático quando reconectar
   ```

4. **Processamento da Fila (SyncWorker):**
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

**Resolução de Conflitos:**
- Timestamps (`updated_at`) são usados para determinar versão mais recente
- Ao sincronizar remoto → local, compara `updated_at`:
  - Se local é mais novo: Mantém dados locais (mudança offline pendente)
  - Se remoto é mais novo: Atualiza local

**Idempotência:**
- Ações são idempotentes sempre que possível
- `CREATE_VACATION_REQUEST` verifica duplicatas antes de inserir
- Erros de chave duplicada são tratados como sucesso

**Decisão:** Implementar sistema completo e robusto de sincronização offline. **Por quê:** Garante experiência consistente e confiável mesmo sem conexão, com sincronização automática e inteligente quando a rede volta. O sistema é resiliente a falhas temporárias e garante eventual consistency.

### core/utils

Contém funções utilitárias puras:
- `date.ts` - Formatação e manipulação de datas
- `masks.ts` - Máscaras de formatação
  - `phoneMask` - Máscara para telefones brasileiros (formato: (XX) XXXXX-XXXX)
- `uuid.ts` - Geração de UUIDs

**Decisão:** permitir apenas funções puras. **Por quê:** melhora previsibilidade e testabilidade.

**Máscaras:**
As máscaras são aplicadas em campos de formulário para formatação automática durante a digitação:
- `phoneMask`: Aplicada no campo de telefone do cadastro e atualização de perfil
- Integração com `ControlledFormField` do design system
- Formatação automática sem necessidade de intervenção do usuário

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
- `auth` - Autenticação, cadastro e gerenciamento de sessão
  - Login com validação de status do usuário
  - Cadastro de novos usuários com informações adicionais
  - Recuperação de senha
  - Gerenciamento de sessão e persistência
- `collaborator` - Funcionalidades do colaborador (solicitar férias, perfil, histórico)
- `manager` - Funcionalidades do gestor (aprovações, equipe)
- `admin` - Funcionalidades do administrador (gerenciamento de usuários, aprovação de cadastros, atualização de perfis)

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
  - `CollaboratorNavigator.tsx` - Navigator principal (Bottom Tab Navigator)
  - `stacks/` - Stacks específicos (HomeStack, VacationStack, ProfileStack)
- `manager/` - Fluxo de navegação do gestor
  - `ManagerNavigator.tsx` - Navigator principal (Bottom Tab Navigator)
  - `stacks/` - Stacks específicos (ManagerHomeStack, ManagerRequestsStack, ManagerProfileStack)
- `admin/` - Fluxo de navegação do administrador
  - `AdminNavigator.tsx` - Navigator principal (Bottom Tab Navigator)
  - `stacks/` - Stacks específicos (AdminHomeStack, AdminUsersStack, AdminReportsStack, AdminProfileStack)
- `types.ts` - Tipos TypeScript para navegação

**Guards baseados em Role:**
- O `AppNavigator` verifica autenticação e role do usuário
- Redireciona para o fluxo apropriado automaticamente
- Usuários não autenticados → Stack de autenticação (RoleSelection, Login, ForgotPassword)

**Decisão:** navegação fora das features. **Por quê:** navegação é infraestrutura, não domínio. Facilita gerenciamento de rotas e guards.

### Fluxos de Autenticação e Cadastro

**Stack de Autenticação:**
- **RoleSelection** (Seleção de Perfil)
  - Permite escolher perfil antes do login: Colaborador, Gestor, Administrador
  - Navegação: RoleSelection → Login, RoleSelection → Register
  
- **Login** (Login)
  - Formulário de login com email e senha
  - Validação Zod (`loginSchema`)
  - Feedback visual para usuários pendentes
  - Botão "Esqueceu sua senha?" (navega para ForgotPassword)
  - Botão "Não tem conta? Cadastre-se" (navega para Register)
  - Validação de status do usuário (bloqueia login se status 'pending' ou 'inactive')
  
- **Register** (Cadastro)
  - Formulário completo de cadastro com validação Zod (`registerSchema`)
  - Campos obrigatórios: nome, email, senha, confirmação de senha
  - Campos opcionais: departamento, cargo, telefone
  - Máscara de telefone para formatação automática (`phoneMask`)
  - Validações:
    - Email: máximo 40 caracteres
    - Nome: máximo 40 caracteres
    - Senha: máximo 10 caracteres
    - Departamento: máximo 25 caracteres
    - Cargo: máximo 40 caracteres
    - Telefone: máximo 25 caracteres
  - Usuários criados com status 'pending' aguardando aprovação do admin
  - Feedback visual com `FeedbackBottomSheet`
  - Navegação para Login após cadastro bem-sucedido
  
- **ForgotPassword** (Recuperar Senha)
  - Formulário para recuperação de senha
  - Integração com Supabase Auth

### Fluxos de Navegação por Perfil

#### 🔵 Perfil: Colaborador

**Navegador Principal:** `CollaboratorNavigator` (Bottom Tab Navigator)

**Tabs:**
1. **Início** (`HomeStack`)
2. **Minhas Férias** (`VacationStack`)
3. **Perfil** (`ProfileStack`)

**Tab Bar:** Cor temática `theme.colors.brand.collaborator` quando ativa

**Stack: HomeStack**
- **CollaboratorHome** (Home)
  - Exibe perfil do colaborador
  - Lista de solicitações recentes (até 3)
  - Botão "Solicitar férias"
  - ProfileTag com animação shimmer
  - Pull-to-refresh para atualizar dados
  - Navegação: Home → RequestVacation, Home → Settings
  
- **RequestVacation** (Solicitar Férias)
  - Formulário para criar nova solicitação de férias
  - Campos: título, data início, data fim, observações
  - Validação de datas
  - Criação offline-first: salva local, sincroniza quando online
  
- **Settings** (Configurações)
  - Informações do perfil
  - Botão "Sair" para logout

**Stack: VacationStack**
- **VacationHistory** (Histórico)
  - Lista todas as solicitações do colaborador
  - Filtros: Todos, Pendentes, Aprovadas, Reprovadas
  - FlashList para performance
  - Pull-to-refresh
  - Atualiza automaticamente ao focar na tela
  - Subscrição realtime para atualizações em tempo real
  - Navegação: VacationHistory → VacationRequestDetails
  
- **VacationRequestDetails** (Detalhes)
  - Detalhes completos de uma solicitação
  - Exibe todas as informações e status

**Stack: ProfileStack**
- **Profile** (Perfil)
  - Informações do colaborador
  - Avatar, nome, email, role, departamento
  - Informações adicionais: cargo, telefone (exibidas quando disponíveis)
  - Saldo de férias (simulado)
  - Botão para editar perfil

---

#### 🟢 Perfil: Gestor (Manager)

**Navegador Principal:** `ManagerNavigator` (Bottom Tab Navigator)

**Tabs:**
1. **Início** (`ManagerHomeStack`)
2. **Solicitações** (`ManagerRequestsStack`)
3. **Perfil** (`ManagerProfileStack`)

**Tab Bar:** Cor temática `theme.colors.brand.manager` quando ativa

**Stack: ManagerHomeStack**
- **ManagerHome** (Home)
  - Exibe perfil do gestor
  - Lista de solicitações pendentes recentes (até 3)
  - ProfileTag com animação shimmer
  - Pull-to-refresh para atualizar dados
  - Navegação: Home → Settings
  
- **Settings** (Configurações)
  - Informações do perfil
  - Botão "Sair" para logout

**Stack: ManagerRequestsStack**
- **ManagerRequests** (Solicitações)
  - Lista todas as solicitações da equipe
  - Filtros: Todas, Pendentes, Aprovadas, Reprovadas
  - FlashList com infinite scroll (10 itens por página)
  - Pull-to-refresh
  - Loading indicator no footer durante paginação
  - Atualiza automaticamente ao focar na tela
  - Subscrição realtime para atualizações
  - Navegação: ManagerRequests → RequestAnalysis
  
- **RequestAnalysis** (Análise)
  - Detalhes da solicitação
  - Exibe: solicitante, título, período, observações
  - Barra de ações (ApprovalActionBar) quando status é 'pending'
  - Botões: Aprovar / Reprovar
  - Aprovação/rejeição offline-first:
    - Atualiza local imediatamente (optimistic update)
    - Sincroniza com remoto em background
    - Enfileira se offline ou se remoto falhar
  - Toast de sucesso/erro
  - Navegação de volta após ação

**Stack: ManagerProfileStack**
- **ManagerProfile** (Perfil)
  - Informações do gestor
  - Avatar, nome, email, role, departamento
  - Informações adicionais: cargo, telefone (exibidas quando disponíveis)
  - Botão para editar perfil

---

#### 🟣 Perfil: Administrador (Admin)

**Navegador Principal:** `AdminNavigator` (Bottom Tab Navigator)

**Tabs:**
1. **Início** (`AdminHomeStack`)
2. **Usuários** (`AdminUsersStack`)
3. **Relatórios** (`AdminReportsStack`)
4. **Perfil** (`AdminProfileStack`)

**Tab Bar:** Cor temática `theme.colors.brand.admin` quando ativa

**Stack: AdminHomeStack**
- **AdminHome** (Home)
  - Dashboard com métricas principais
  - Cards: Cadastros pendentes, Total colaboradores, Total gestores
  - Lista de novos membros
  - Card "Visualizar usuários" (navega para tab Usuários)
  - ProfileTag com animação shimmer
  - Pull-to-refresh para atualizar dados
  - Navegação: Home → Settings, Home → PendingRegistrations
  
- **Settings** (Configurações)
  - Informações do perfil
  - Botão "Sair" para logout
  
- **PendingRegistrations** (Cadastros Pendentes)
  - Lista usuários com status 'pending'
  - Navegação: PendingRegistrations → RegistrationDetails
  
- **RegistrationDetails** (Detalhes do Cadastro)
  - Detalhes completos do usuário pendente
  - Informações: nome, email, role
  - Informações adicionais: departamento, cargo, telefone (exibidas quando disponíveis)
  - Botões: Aprovar / Reprovar
  - Aprovação/rejeição offline-first (mesma estratégia do Manager)
  - Dialog customizado para confirmação (substitui Alert.alert)

**Stack: AdminUsersStack**
- **AdminUsers** (Usuários)
  - Lista usuários ativos (status 'active')
  - Filtros por role: Todos, Colaboradores, Gestores
  - Campo de busca por nome/email
  - FlashList para performance
  - Pull-to-refresh
  - Atualiza automaticamente ao focar na tela
  - Navegação: AdminUsers → UserDetails
  
- **UserDetails** (Detalhes do Usuário)
  - Informações completas do usuário
  - Avatar, nome, email, role, status, data de criação
  - Informações adicionais: departamento, cargo, telefone (quando disponíveis)
  - Botões de ação:
    - **Solicitações**: Navega para lista de solicitações do usuário
    - **Alterar perfil**: Navega para tela de atualização de perfil
    - **Ativar/Desativar usuário**
  - Ativação/desativação offline-first
  - Navegação: UserDetails → UserRequests, UserDetails → UpdateProfile
  
- **UpdateProfile** (Atualizar Perfil)
  - Permite alterar role (Colaborador, Gestor, Admin)
  - Editar informações adicionais: departamento, cargo, telefone
  - Formulário com validação Zod (`updateProfileSchema`)
  - Máscara de telefone para formatação automática
  - Feedback visual com `FeedbackBottomSheet`
  - Atualização offline-first com sincronização automática
  - Navegação de volta após atualização bem-sucedida
  
- **UserRequests** (Solicitações do Usuário)
  - Lista todas as solicitações de um usuário específico
  - Filtros: Todos, Pendentes, Aprovadas, Reprovadas
  - FlashList para performance
  - Pull-to-refresh
  - Navegação: UserRequests → UserRequestAnalysis
  
- **UserRequestAnalysis** (Análise da Solicitação)
  - Detalhes da solicitação do usuário
  - Mesma interface de análise do Manager
  - Barra de ações para aprovar/rejeitar (quando status 'pending')
  - Admin pode aprovar/rejeitar solicitações de qualquer usuário
  - Funciona offline-first

**Stack: AdminReportsStack**
- **AdminReports** (Relatórios)
  - Dashboard com métricas detalhadas
  - Cards de métricas:
    - Solicitações: Total, Aprovadas, Pendentes, Reprovadas
    - Usuários do Sistema: Total colaboradores, Total gestores
    - Este Mês: Novas solicitações, Aprovadas, Novos cadastros
  - Dados atualizados em tempo real via Supabase Realtime
  - Pull-to-refresh
  - Atualiza automaticamente ao focar na tela

**Stack: AdminProfileStack**
- **AdminProfile** (Perfil)
  - Informações do administrador
  - Avatar, nome, email, role
  - Informações adicionais: departamento, cargo, telefone (exibidas quando disponíveis)
  - Botão para editar perfil

---

### Características Comuns dos Fluxos

**Bottom Tab Bar:**
- Customizada usando `GenericBottomTabBar`
- Cores temáticas por perfil (collaborator, manager, admin)
- Ícones Material Community Icons
- Labels localizados em português

**Headers:**
- Headers customizados usando componentes do design system
- `HeaderTitle` para títulos
- `HeaderBackButton` para botão voltar
- `HeaderIconAction` para ações no header

**Atualização de Dados:**
- `useFocusEffect` para atualizar dados ao focar telas
- Pull-to-refresh em listas principais
- Subscrição Supabase Realtime para atualizações em tempo real
- Sincronização automática com remoto quando online

**Offline-First:**
- Todas as ações funcionam offline
- Dados são salvos localmente primeiro
- Sincronização automática quando conexão é restaurada
- UX otimista: atualizações aparecem imediatamente

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

**Tabelas SQLite (Schema Local):**
- `sync_queue` - Fila de ações pendentes para sincronização
  - Campos: id, type, payload (JSON), created_at, retry_count, status
- `auth_session` - Cache de sessão de autenticação
  - Campos: id, email, name, role, status, created_at, avatar
- `vacation_requests` - Cache de solicitações de férias
  - Campos: id, user_id, title, start_date, end_date, status, collaborator_notes, manager_notes, created_at, updated_at, requester_name, requester_avatar
- `admin_reports` - Cache de relatórios do admin
- `admin_pending_users` - Cache de usuários pendentes
  - Campos: id, email, name, role, status, created_at, department, position, phone
- `admin_users` - Cache de usuários ativos
  - Campos: id, email, name, role, status, created_at, department, position, phone

**Informações Adicionais de Perfil:**
O sistema suporta informações adicionais opcionais nos perfis de usuário:
- `department` (departamento) - Campo de texto, máximo 25 caracteres
- `position` (cargo) - Campo de texto, máximo 40 caracteres
- `phone` (telefone) - Campo de texto com máscara, máximo 25 caracteres

Essas informações são:
- Opcionais no cadastro de novos usuários
- Editáveis pelo administrador na tela de atualização de perfil
- Exibidas nas telas de perfil quando disponíveis
- Armazenadas na tabela `profiles` do Supabase e cacheadas localmente

**Mapeamento Remoto ↔ Local:**
- Datasources remotos buscam do PostgreSQL (Supabase)
- Datasources locais salvam no SQLite
- Repositórios orquestram: buscam remoto quando online, salvam local, retornam local
- Campos derivados (`requester_name`, `requester_avatar`) são cacheados localmente para melhor performance

**Decisão:** combinar AsyncStorage + SQLite. **Por quê:** AsyncStorage atende configurações simples, enquanto SQLite garante consistência e performance para dados complexos em modo offline.

## 🧪 Testes

**Estratégia:**
O projeto utiliza **exclusivamente testes de integração** que validam o fluxo completo das funcionalidades, desde a camada de apresentação até a persistência.

**Por que apenas testes de integração?**
- ✅ Validam o comportamento real do sistema end-to-end
- ✅ Testam integração entre camadas (UI → UseCase → Repository → Datasource)
- ✅ Garantem que a lógica de negócio funciona corretamente com dependências reais
- ✅ Use cases são funções puras e facilmente testáveis sem mocks complexos

**Features com testes de integração:**
- `auth/tests/auth.integration.test.ts` - Autenticação e sessão
  - Testa login com credenciais reais
  - Valida persistência de sessão
  - Verifica restauração de sessão após reinicialização
  - Testa logout e limpeza de sessão
  
- `collaborator/tests/vacation.integration.test.ts` - Solicitações de férias
  - Testa criação de solicitações
  - Valida cache local e sincronização remota
  - Testa estratégia offline-first
  
- `manager/tests/manager.integration.test.ts` - Aprovações e gestão de equipe
  - Testa listagem de solicitações da equipe
  - Valida aprovação/rejeição de solicitações
  - Testa sincronização offline
  
- `admin/tests/admin.integration.test.ts` - Gerenciamento de usuários e relatórios
  - Testa listagem de usuários
  - Valida aprovação/rejeição de cadastros pendentes
  - Testa atualização de perfis de usuário
  - Valida geração de relatórios

**Ferramentas:**
- Jest
- @testing-library/react-native

**Setup de Testes:**
- Mock de AsyncStorage para isolamento
- Reset de banco de dados antes de cada teste (`_test_resetDB()`)
- Setup e teardown de autenticação para testes que requerem sessão
- Limpeza de recursos criados durante testes (após cada teste e após todos)

**Decisão:** focar em testes de integração end-to-end. **Por quê:** garantem que o sistema funciona corretamente como um todo, validando integrações entre camadas e comportamento real. Use cases são fáceis de testar por serem funções puras, e testes de integração dão maior confiança no comportamento do sistema completo.

## 🏁 Conclusão

Esta arquitetura foi definida para:
- Demonstrar senioridade técnica
- Permitir troca de bibliotecas sem impacto estrutural
- Suportar offline-first de forma consistente e robusta
- Facilitar testes e manutenção
- Escalar o produto sem refatorações estruturais

Ela atende integralmente aos requisitos do desafio e reflete práticas utilizadas em aplicações reais de produção.

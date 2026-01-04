# Esquema do Banco de Dados - Módulo Colaborador

Este documento descreve o esquema do banco de dados projetado para suportar as funcionalidades do colaborador no aplicativo "On Vacation", incluindo perfil, solicitações de férias e histórico de status.

## Visão Geral

O banco de dados utiliza uma arquitetura híbrida:
- **PostgreSQL (Supabase)**: Banco de dados remoto para persistência centralizada
- **SQLite (Local)**: Banco de dados local para cache e operações offline-first

As principais tabelas são:

1.  **`profiles`**: Armazena informações públicas dos usuários.
2.  **`vacation_requests`**: Armazena as solicitações de férias.
3.  **`vacation_status_history`**: Armazena o histórico de alterações de status de cada solicitação.

### Arquitetura Offline-First

O aplicativo segue uma estratégia offline-first:
- Todas as operações são primeiro realizadas localmente (SQLite)
- Sincronização automática com o remoto (PostgreSQL) quando online
- Fila de retry (`sync_queue`) para operações pendentes
- Cache local inclui campos derivados como `requester_name` e `requester_avatar` para melhor performance

---

## Detalhes das Tabelas

### 1. Tabela `profiles`

Estende a tabela `auth.users` do Supabase com informações específicas da aplicação.

| Coluna | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Identificador único do usuário. | **PK**, FK -> `auth.users(id)` |
| `email` | `text` | Endereço de e-mail do usuário. | |
| `name` | `text` | Nome completo do usuário. | |
| `avatar_url` | `text` | URL da imagem de perfil. | |
| `role` | `text` | Papel do usuário no sistema. | Check: 'Gestor', 'Administrador', 'Colaborador' |
| `status` | `text` | Status da conta. | Check: 'active', 'pending', 'inactive'. Default: 'pending' |
| `created_at` | `timestamptz` | Data de criação do perfil. | Default: `now()` |
| `updated_at` | `timestamptz` | Data da última atualização. | Default: `now()` |

**Segurança (RLS):**
*   **Leitura:** 
    - Administradores podem ver todos os perfis
    - Gestores podem ver perfis dos colaboradores de sua equipe
    - Usuários podem ver perfis básicos de outros usuários
*   **Escrita/Edição:** 
    - Administradores podem criar e editar qualquer perfil
    - Usuários podem criar e editar apenas seu próprio perfil
    - Status 'pending' requer aprovação de administrador para mudar para 'active'
    - Apenas usuários com status 'active' podem fazer login

**Fluxo de Cadastro:**
1. Novo usuário é criado com status 'pending'
2. Administrador aprova o cadastro (status → 'active')
3. Usuário pode então fazer login e utilizar o sistema

---

### 2. Tabela `vacation_requests`

Armazena os detalhes de cada solicitação de férias feita por um colaborador.

| Coluna | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Identificador único da solicitação. | **PK**, Default: `uuid_generate_v4()` |
| `user_id` | `uuid` | ID do colaborador que fez a solicitação. | FK -> `profiles(id)` |
| `title` | `text` | Título da solicitação (ex: "Férias de Verão"). | Not Null |
| `start_date` | `date` | Data de início das férias. | Not Null |
| `end_date` | `date` | Data de término das férias. | Not Null |
| `status` | `text` | Status atual da solicitação. | Check: 'pending', 'approved', 'rejected', 'completed', 'cancelled'. Default: 'pending' |
| `collaborator_notes` | `text` | Observações do colaborador ao solicitar. | |
| `manager_notes` | `text` | Observações do gestor ao aprovar/rejeitar. | |
| `created_at` | `timestamptz` | Data de criação da solicitação. | Default: `now()` |
| `updated_at` | `timestamptz` | Data da última atualização. | Default: `now()` |

**Segurança (RLS):**
*   **Leitura:** 
    - Colaboradores podem ver apenas suas próprias solicitações
    - Gestores podem ver todas as solicitações da equipe
    - Administradores podem ver todas as solicitações do sistema
*   **Escrita:** 
    - Colaboradores podem criar solicitações apenas para si mesmos
    - Gestores podem atualizar status e adicionar `manager_notes` nas solicitações da equipe
    - Administradores podem atualizar qualquer solicitação

**Campos Cacheados (SQLite Local):**
O banco local também armazena `requester_name` e `requester_avatar` para melhor performance e uso offline, derivados da tabela `profiles`.

---

### 3. Tabela `vacation_status_history`

Registra a linha do tempo de evolução do status de uma solicitação (ex: Solicitado -> Aprovado -> Concluído).

| Coluna | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Identificador único do registro de histórico. | **PK**, Default: `uuid_generate_v4()` |
| `request_id` | `uuid` | ID da solicitação associada. | FK -> `vacation_requests(id)` (On Delete Cascade) |
| `status` | `text` | O status técnico registrado neste ponto. | Not Null |
| `label` | `text` | O rótulo exibido na UI (ex: "Solicitado"). | |
| `notes` | `text` | Notas opcionais sobre a mudança de status. | |
| `created_at` | `timestamptz` | Data/hora em que o status foi alcançado. | Default: `now()` |

**Segurança (RLS):**
*   **Leitura:** 
    - Colaboradores podem ver o histórico de suas próprias solicitações
    - Gestores podem ver o histórico das solicitações da equipe
    - Administradores podem ver o histórico de todas as solicitações
*   **Escrita:** 
    - Apenas gestores e administradores podem inserir novos registros de histórico ao aprovar/rejeitar solicitações

---

## Relacionamentos

*   **1 Usuário (Profile)** pode ter **N Solicitações (Vacation Requests)**.
*   **1 Solicitação (Vacation Request)** pode ter **N Históricos de Status (Vacation Status History)**.

## Status e Transições

### Status de Usuário (`profiles.status`)

| Status | Descrição | Pode fazer login? |
|--------|-----------|-------------------|
| `pending` | Usuário criado, aguardando aprovação do administrador | ❌ Não |
| `active` | Usuário aprovado e ativo no sistema | ✅ Sim |
| `inactive` | Usuário desativado pelo administrador | ❌ Não |

### Status de Solicitação (`vacation_requests.status`)

| Status | Descrição | Quem pode criar/atualizar |
|--------|-----------|---------------------------|
| `pending` | Solicitação criada, aguardando análise | Colaborador (criar), Gestor/Admin (atualizar) |
| `approved` | Solicitação aprovada pelo gestor/admin | Gestor/Admin |
| `rejected` | Solicitação reprovada pelo gestor/admin | Gestor/Admin |
| `completed` | Período de férias concluído | Sistema (futuro) |
| `cancelled` | Solicitação cancelada pelo colaborador | Colaborador (futuro) |

## Estratégia de Sincronização

O aplicativo implementa uma estratégia offline-first com os seguintes componentes:

1. **Cache Local (SQLite)**: Todas as operações são primeiro persistidas localmente
2. **Fila de Sincronização (`sync_queue`)**: Operações pendentes são enfileiradas quando offline
3. **Sincronização Automática**: Quando online, a fila é processada automaticamente
4. **Resolução de Conflitos**: Timestamps (`updated_at`) são usados para determinar a versão mais recente

### Fluxo de Criação de Solicitação

1. Colaborador cria solicitação → Salva no SQLite local imediatamente
2. Se online → Tenta criar no PostgreSQL remoto
   - Se sucesso → Atualiza dados locais com dados remotos (para garantir consistência)
   - Se falha → Adiciona à fila de sincronização
3. Se offline → Adiciona à fila de sincronização
4. Quando reconectar → Processa fila automaticamente

### Fluxo de Aprovação/Rejeição

1. Gestor/Admin aprova/rejeita → Atualiza SQLite local imediatamente (otimistic update)
2. Se online → Tenta atualizar PostgreSQL remoto em background
   - Se sucesso → Processa fila de sincronização
   - Se falha → Adiciona à fila de sincronização
3. Se offline → Adiciona à fila de sincronização
4. Quando reconectar → Processa fila automaticamente


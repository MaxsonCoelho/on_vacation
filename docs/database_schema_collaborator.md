# Esquema do Banco de Dados - Módulo Colaborador

Este documento descreve o esquema do banco de dados projetado para suportar as funcionalidades do colaborador no aplicativo "On Vacation", incluindo perfil, solicitações de férias e histórico de status.

## Visão Geral

O banco de dados utiliza o PostgreSQL (via Supabase) e segue uma estrutura relacional. As principais tabelas são:

1.  **`profiles`**: Armazena informações públicas dos usuários.
2.  **`vacation_requests`**: Armazena as solicitações de férias.
3.  **`vacation_status_history`**: Armazena o histórico de alterações de status de cada solicitação.

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
| `status` | `text` | Status da conta (ex: 'active'). | Default: 'active' |
| `created_at` | `timestamptz` | Data de criação do perfil. | Default: `now()` |
| `updated_at` | `timestamptz` | Data da última atualização. | Default: `now()` |

**Segurança (RLS):**
*   **Leitura:** Pública (todos podem ver perfis básicos).
*   **Escrita/Edição:** O próprio usuário pode criar e editar seu perfil.

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
*   **Leitura:** Usuários podem ver apenas suas próprias solicitações.
*   **Escrita:** Usuários podem criar solicitações apenas para si mesmos.

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
*   **Leitura:** Usuários podem ver o histórico de solicitações que pertencem a eles.

---

## Relacionamentos

*   **1 Usuário (Profile)** pode ter **N Solicitações (Vacation Requests)**.
*   **1 Solicitação (Vacation Request)** pode ter **N Históricos de Status (Vacation Status History)**.


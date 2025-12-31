🏗️ Arquitetura do Sistema
Visão Geral
Este projeto adota uma Clean Architecture orientada a Features, com forte ênfase em paradigma
funcional, offline-first e baixo acoplamento com bibliotecas externas. A arquitetura foi pensada para
demonstrar maturidade técnica, clareza de decisões e facilidade de evolução.

A aplicação é organizada em três grandes blocos:

App (Shell da aplicação) – composição, navegação e providers
Core (infraestrutura e abstrações compartilhadas)
Features (domínios de negócio isolados)

Decisão: usar Clean Architecture orientada a Features. Por quê: essa abordagem mantém o
domínio protegido, facilita testes e permite escalar o produto sem refatorações estruturais.

🎯 Princípios Arquiteturais
Organização por feature (feature-first)
Dependências sempre apontam para dentro
Domínio independente de UI e bibliotecas
Paradigma funcional como padrão
Efeitos colaterais isolados em camadas externas
Offline-first como premissa
Core como ponto único de abstração
Decisão: combinar Clean Architecture + funcional + offline-first. Por quê: reduz complexidade
acidental e aproxima o projeto de cenários reais de produção.

📁 Estrutura Geral de Pastas
src/
├── app/
│ ├── navigation/
│ ├── providers/
│ └── App.tsx
│
├── core/
│ ├── design-system/
│ ├── facades/
│ ├── state/
1
│ ├── persistence/
│ ├── utils/
│ └── types/
│
│
├── features/
│ ├── auth/
│ ├── vacation/
│ ├── approvals/
│ └── users/
└── shared/
├── hooks/
└── constants/

Decisão: separar App, Core e Features. Por quê: deixa responsabilidades explícitas e evita
dependências cruzadas.

🧠 CORE — Camada de Infraestrutura e Abstrações
O Core concentra tudo que é transversal, reutilizável e independente das regras específicas de
negócio.
core/design-system
Contém: - Componentes reutilizáveis (Button, Input, Card, Modal, Alert, Loader, EmptyState) - Tokens de
design (cores, tipografia, espaçamento)
Decisão: centralizar o Design System no Core. Por quê: garante consistência visual e reduz
duplicação.
core/facades
Responsável por abstrair bibliotecas externas em funções próprias do projeto.
Características: - Cada biblioteca possui seu próprio arquivo de facade - Exemplo: - storage.facade.ts
→ AsyncStorage - database.facade.ts → SQLite - auth.facade.ts → biblioteca de autenticação

Decisão: usar facades como camada de abstração de bibliotecas. Por quê: permite trocar
qualquer biblioteca alterando apenas o arquivo de facade, sem impacto no domínio ou nas
features.

core/state
Responsável pelo gerenciamento de estado global da aplicação.
Ferramenta escolhida: - Zustand
Decisão: usar Zustand para gerenciamento de estado. Por quê: é simples, performático, não
verboso e se encaixa bem com paradigma funcional, evitando boilerplate desnecessário.
Uso do estado: - Apenas estado realmente compartilhado - Estado local permanece nos componentes
core/persistence
Responsável pela persistência de dados e estratégia offline-first.
Tecnologias: - AsyncStorage: dados simples e chave-valor - SQLite: dados estruturados e históricos
Decisão: combinar AsyncStorage + SQLite. Por quê: AsyncStorage atende configurações
simples, enquanto SQLite garante consistência e performance para dados complexos em
modo offline.
core/utils
Contém: - Funções utilitárias puras - Formatadores - Helpers genéricos
Decisão: permitir apenas funções puras. Por quê: melhora previsibilidade e testabilidade.
core/types
Contém: - Tipos globais - Enums compartilhados (Roles, Status)

Decisão: tipagem centralizada. Por quê: melhora DX e reduz erros em tempo de
desenvolvimento.

🧩 FEATURES — Domínios de Negócio
Cada feature representa um domínio isolado, seguindo o mesmo padrão estrutural.

Estrutura padrão de uma Feature
features/vacation/
├── data/
├── domain/
├── useCases/
├── presentation/
└── index.ts
Decisão: padronizar a estrutura das features. Por quê: facilita leitura, manutenção e
onboarding.
feature/data
Responsável por: - Acesso a facades de persistência - Mapeamento DTO ↔ Domain
Decisão: separar dados do negócio. Por quê: mudanças de persistência não afetam regras.
feature/domain
Responsável por: - Entidades do domínio - Regras específicas da feature
Decisão: domínio isolado por feature. Por quê: mantém regras coesas e localizadas.
feature/useCases
Responsável por: - Casos de uso como funções puras - Dependências recebidas por composição
Exemplo conceitual:
requestVacation(deps)(input) => Result
Decisão: use cases funcionais. Por quê: fluxo explícito, previsível e fácil de testar.
feature/presentation
Responsável por: - Screens - ViewModels - Integração com estado (Zustand)

Decisão: UI sem regra de negócio. Por quê: evita duplicação e acoplamento.

🔄 Paradigma Funcional
Práticas adotadas: - Funções puras como padrão - Imutabilidade - Composição ao invés de herança - Efeitos
colaterais isolados em facades
Decisão: priorizar paradigma funcional. Por quê: reduz complexidade e melhora a
confiabilidade do código.

🧭 Navegação
Local: app/navigation
Fluxos separados por perfil (Colaborador, Gestor, Administrador)
Guards baseados em Role

Decisão: navegação fora das features. Por quê: navegação é infraestrutura, não domínio.

🧪 Testes
Estratégia: - UseCases: testes unitários puros - Facades: testes com mocks - Persistência: testes isolados
Decisão: priorizar testes de regras. Por quê: maior retorno de valor com menor esforço.

🏁 Conclusão
Esta arquitetura foi definida para: - Demonstrar senioridade técnica - Permitir troca de bibliotecas sem
impacto estrutural - Suportar offline-first de forma consistente - Facilitar testes e manutenção
Ela atende integralmente aos requisitos do desafio e reflete práticas utilizadas em aplicações reais de
produção.
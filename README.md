🏖️ OnVacation

OnVacation é um aplicativo mobile desenvolvido em React Native + Expo + TypeScript, com foco em experiência do usuário, arquitetura escalável, offline-first e separação rigorosa de responsabilidades.
O app gerencia solicitações de férias, aprovações e cadastro de colaboradores, atendendo diferentes perfis de usuário: Colaborador, Gestor e Administrador.

🎯 Objetivo do Projeto

Demonstrar domínio técnico em:

Arquitetura moderna e bem definida

Paradigma funcional

Isolamento de dependências externas

Gerenciamento de estado previsível

Persistência local e suporte offline

Código limpo, testável e escalável

🧠 Princípios Arquiteturais

Clean Architecture adaptada para Mobile

Paradigma funcional

Offline-first

Feature-based architecture

Baixo acoplamento e alta coesão

Dependência sempre apontando para dentro (domain)

🏗️ Arquitetura Geral
src/
 ├── app/            # Providers, rotas e bootstrap da aplicação
 ├── core/           # Código compartilhado e infraestrutura global
 ├── features/       # Funcionalidades organizadas por domínio
 └── shared/         # Utilitários reutilizáveis e helpers

🧩 Core Layer

O core concentra tudo que é transversal ao sistema.

core/
 ├── design-system/     # Tokens visuais, temas e componentes base
 ├── facades/           # Abstração de bibliotecas externas
 ├── services/          # Serviços globais (ex: storage, network)
 ├── storage/           # AsyncStorage + SQLite
 ├── state/             # Gerenciamento de estado global
 ├── types/             # Tipagens globais
 └── utils/             # Helpers puros e reutilizáveis

📌 Decisões Importantes

Facades isolam bibliotecas externas para permitir troca futura sem impacto.

Design System garante consistência visual e escalabilidade.

Storage centralizado simplifica o modelo offline-first.

🧠 Gerenciamento de Estado

Utilizamos Zustand como gerenciador de estado global.

Por quê?

API simples e funcional

Menos boilerplate que Redux

Excelente performance

Fácil integração com hooks e testes

💾 Persistência & Offline-first

AsyncStorage → dados leves, sessão e preferências

SQLite → dados estruturados e uso offline

Por quê?

Permite funcionamento sem conexão

Melhora UX em ambientes instáveis

Facilita sincronização futura

🧱 Estrutura de Features

Cada feature é autônoma, com separação clara entre camadas.

features/<feature-name>/
 ├── data/
 │   ├── datasources/   # APIs, banco local, cache
 │   ├── repositories/  # Implementações concretas
 │   └── mappers/       # Conversão DTO ↔ Entity
 │
 ├── domain/
 │   ├── entities/      # Modelos de negócio
 │   ├── types/         # Tipos e contratos
 │   └── rules/         # Regras puras de domínio
 │
 ├── useCases/          # Orquestração da lógica de negócio
 │
 ├── presentation/
 │   ├── screens/       # Telas
 │   ├── components/    # Componentes específicos da feature
 │   └── viewModel.ts   # Estado e ações da UI
 │
 └── index.ts

📌 Por quê essa estrutura?

Facilita manutenção

Evita dependências cruzadas

Permite evolução independente de cada feature

Facilita testes unitários

👥 Perfis de Usuário

Colaborador

Solicita férias

Acompanha status

Gestor

Aprova ou rejeita solicitações

Administrador

Aprova cadastro de colaboradores

Gerencia usuários

🧪 Testes

Jest

@testing-library/react-native

Testes focam em:

UseCases

Regras de domínio

ViewModels

A UI permanece simples e desacoplada da lógica.

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

📐 Padrões de Código

TypeScript estrito

Funções puras sempre que possível

Sem classes para lógica de negócio

UI desacoplada de regras

Imports sempre por índice (index.ts)

🧭 Evolução Planejada

Sincronização online/offline

Cache inteligente

Feature flags

Observabilidade

Modularização por micro-features

👨‍💻 Autor

Maxson Coelho
Desenvolvedor Mobile & Frontend
Especialista em arquitetura, UX e sistemas escaláveis

🏁 Considerações Finais

Este projeto prioriza clareza arquitetural, qualidade de código e experiência do usuário, servindo como base sólida para aplicações reais em produção.
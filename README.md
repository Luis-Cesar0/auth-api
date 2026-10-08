# 🔐 Auth API

API de autenticação desenvolvida com **NestJS, TypeScript, PostgreSQL e Prisma ORM**.

O projeto implementa cadastro e autenticação de usuários utilizando **JWT**, armazenamento seguro de senhas com **bcrypt** e proteção de rotas através de um `AuthGuard`.

Este projeto faz parte dos meus estudos e evolução prática em arquitetura backend com Node.js.

---

## 🚀 Tecnologias

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)

---

## 📌 Funcionalidades

- Cadastro de usuários
- Hash de senha com bcrypt
- Autenticação por e-mail e senha
- Geração de token JWT
- Proteção de rotas com AuthGuard
- Persistência de usuários com Prisma ORM
- PostgreSQL como banco de dados
- Tratamento de conflito para e-mails já cadastrados
- Schemas de dados com Zod
- Estrutura modular utilizando NestJS

---

## 🏗️ Estrutura

```text
src/
├── auth/
│   ├── DTOS/
│   ├── auth.controller.ts
│   ├── auth.guard.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── constants.ts
│
├── prisma/
│   └── prisma.service.ts
│
├── app.module.ts
└── main.ts

prisma/
└── schema.prisma

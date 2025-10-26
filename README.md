# 🧩 Todo API CSV

**Todo API CSV** is a lightweight yet production-ready REST API for managing tasks using **Node.js**, **Express**, and **SQLite**.
It supports full CRUD operations, input validation with **Zod**, and **CSV import/export** for bulk task management.

Built with a clean, layered architecture and modern ES modules, it’s designed to be simple, fast, and easily extensible — ideal for learning clean architecture patterns or for small internal tools.

## 🧠 Motivation

This project was born as a minimalist example of how to build a **clean and maintainable backend** without heavy frameworks.
It demonstrates how to:

* Keep your project modular and testable.
* Handle structured validation using **Zod**.
* Implement **CSV import** logic safely and atomically.
* Use **SQLite** in Write-Ahead Logging mode for reliability.
* Follow a clean project structure that scales.

It’s a perfect reference for junior developers or interview portfolios showing backend fundamentals done right.

## 🧱 Project Architecture

The application follows a **layered (Clean Architecture-inspired)** structure:

```
src/
├── app/
│   ├── routes/        → Express route definitions
│   ├── schemas/       → Zod validation schemas
│   ├── services/      → Business logic layer
│   ├── middlewares/   → Error handling, logging, etc.
│   └── app.js         → Express setup
│
├── repositories/      → Data access layer (SQLite queries)
├── config/            → DB, migrations, environment
├── utils/             → Helpers (CSV parsing, HTTP utilities)
└── index.js           → Entry point (server bootstrap)
```

### Flow Overview

1. **Routes** receive and validate incoming requests.
2. **Services** handle business rules and orchestration.
3. **Repositories** perform database operations.
4. **SQLite** persists tasks, using WAL mode for concurrency safety.

This approach ensures each part of the system is independent, testable, and easy to modify.

## ⚙️ Tech Stack

| Layer         | Technology                                                                       | Purpose                            |
| :------------ | :------------------------------------------------------------------------------- | :--------------------------------- |
| Runtime       | [Node.js 20+](https://nodejs.org/)                                               | ES module-based backend runtime    |
| Web Framework | [Express](https://expressjs.com/)                                                | REST routing and middleware        |
| Database      | [SQLite + better-sqlite3](https://github.com/WiseLibs/better-sqlite3)            | Fast, file-based persistence       |
| Validation    | [Zod](https://zod.dev/)                                                          | Schema validation for all inputs   |
| File Uploads  | [Multer](https://github.com/expressjs/multer)                                    | Multipart/form-data parsing        |
| CSV Parsing   | [csv-parse](https://csv.js.org/parse/)                                           | Tolerant CSV import logic          |
| Security      | [helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors) | HTTP headers & cross-origin safety |
| Logging       | [morgan](https://github.com/expressjs/morgan)                                    | Request logging                    |
| UUIDs         | [uuid](https://github.com/uuidjs/uuid)                                           | Unique task identifiers            |

## ▶️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/HarukaYamamoto0/todo-api-csv.git
cd todo-api-csv
npm install
```

### 2. Run Database Migrations

```bash
npm run migrate
```

Creates or updates `data/tasks.db` automatically.

### 3. Start the API

```bash
npm run dev     # development mode (auto logs)
# or
npm start       # production mode
```

Server runs at:
👉 **[http://localhost:3333](http://localhost:3333)**

## 🔌 API Endpoints

### ➕ Create a Task

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Study Kotlin","description":"Coroutines section"}'
```

### 📋 List Tasks (with filters & pagination)

```bash
curl "http://localhost:3333/tasks?title=kotlin&perPage=5&page=1"
```

### 🔍 Get by ID

```bash
curl http://localhost:3333/tasks/<id>
```

### ✏️ Update Task

```bash
curl -X PATCH http://localhost:3333/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Study Kotlin (updated)"}'
```

### ✅ Mark as Complete / ❌ Undo

```bash
curl -X PATCH http://localhost:3333/tasks/<id>/complete
curl -X PATCH http://localhost:3333/tasks/<id>/uncomplete
```

### 🗑️ Delete Task

```bash
curl -X DELETE http://localhost:3333/tasks/<id>
```

### 📦 Import from CSV

```bash
curl -X POST http://localhost:3333/tasks/import \
  -F "file=@./tasks.csv"
```

#### Valid CSV examples

With header:

```csv
title,description
Pay bills,Due by the 30th
Study Android,Room + Coroutines
```

Without header:

```csv
Buy bread,On the way home
Practice JS,Review Node streams
```

## 🧪 Reliability & Design Highlights

* ✅ **Strict input validation** via Zod in all mutation routes
* ✅ **Graceful error responses** (400 / 404 / 500 distinction)
* ✅ **CSV import tolerant to**:

    * BOM headers
    * Empty lines
    * Missing or mixed column headers
    * Common synonyms (`titulo`, `desc`, `descrição`)
    * Accumulates per-line errors and returns samples
* ✅ **Transactional CSV insertions** — either all rows succeed or none
* ✅ **SQLite in WAL mode** — safe concurrent writes
* ✅ **Indexes** on title and completion fields for efficient filtering
* ✅ **Rate-safe defaults** — JSON body ≤ 1 MB, uploads ≤ 5 MB
* ✅ **Security middleware** — `helmet`, `cors`, structured logging

## 🧩 Example Project Structure

```
.
├── data
│   ├── tasks.db
│   ├── tasks.db-shm
│   └── tasks.db-wal
├── .gitignore
├── .idea
│   ├── cat-activity.xml
│   ├── dictionaries
│   │   └── project.xml
│   ├── .gitignore
│   ├── inspectionProfiles
│   │   └── Project_Default.xml
│   ├── modules.xml
│   ├── todo-api-csv.iml
│   ├── vcs.xml
│   └── workspace.xml
├── package.json
├── README.md
├── src
│   ├── app
│   │   ├── app.js
│   │   ├── middlewares
│   │   │   └── errorHandler.js
│   │   ├── routes
│   │   │   └── task.routes.js
│   │   ├── schemas
│   │   │   └── task.schema.js
│   │   └── services
│   │       └── task.service.js
│   ├── config
│   │   ├── db.js
│   │   └── migrate.js
│   ├── index.js
│   ├── repositories
│   │   └── task.repository.js
│   └── utils
│       └── http.js
└── tasks.csv
```
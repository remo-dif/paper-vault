# Paper Vault

Paper Vault is a NestJS API for storing and querying research paper metadata.
It uses PostgreSQL through TypeORM and includes an explicit CSV import command
for loading `papers.csv`.

## Requirements

- Node.js 18+
- npm
- PostgreSQL

## Configuration

Create a `.env` file with:

```env
PORT=3000
TYPEORM_URL=postgres://user:password@localhost:5432/db
TYPEORM_SYNCHRONIZE=true
```

`TYPEORM_SYNCHRONIZE=true` is convenient for local development only. Use
migrations for production.

## Install

```bash
npm install
```

## Run

```bash
npm run start:dev
```

The API listens on `http://localhost:3000` by default.

## Import Papers

CSV imports are intentional and do not run during application startup.

```bash
npm run import:papers
```

The default command imports `papers.csv` from the project root. The importer
streams the file, writes in batches, and upserts rows by paper `id`.

## API

### Create a paper

```http
POST /papers
Content-Type: application/json

{
  "title": "A paper title",
  "abstract": "Optional abstract",
  "authors": ["Ada Lovelace"],
  "venue": "ExampleConf",
  "year": 2025,
  "nCitation": 12,
  "references": []
}
```

### List papers

```http
GET /papers?limit=25&offset=0
GET /papers?author=Ada%20Lovelace
GET /papers?title=neural
```

The response is paginated:

```json
{
  "data": [],
  "limit": 25,
  "offset": 0,
  "total": 0
}
```

### Other routes

```http
GET /papers/:id
PUT /papers/:id
DELETE /papers/:id
```

## Validation

Requests are validated globally with Nest's `ValidationPipe`:

- unknown fields are rejected
- query string numbers are transformed
- DTO decorators enforce arrays, integers, UUID references, and string fields

## Docker

```bash
docker compose up --build
```

The Docker Compose file starts the API, PostgreSQL, and pgAdmin.

## Tests

```bash
npm test
npm run build
```

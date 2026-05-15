# PokeAPI Cypress

Automatizacion de pruebas API para [PokeAPI](https://pokeapi.co/) usando Cypress.

## Alcance de pruebas

Este proyecto valida los siguientes escenarios:

- `GET /api/v2/berry/{id}` con `id` valido.
- `GET /api/v2/berry/{id}` con `id` invalido.
- `GET /api/v2/berry/{name}` con `name` valido.
- `GET /api/v2/berry/{name}` con `name` invalido.
- `GET /api/v2/berry-flavor/{name}` con flavor valido (`spicy`).
- Flujo encadenado para flavor `spicy`: obtener berries, seleccionar la de mayor `potency` (desempate alfabetico por nombre), consultar `GET /api/v2/berry/{selectedName}` y validar consistencia de `potency`.

## Stack tecnico

- Cypress `13.17.0`
- `@bahmutov/cy-grep` `2.1.0` para ejecucion por tags
- Reporteria JUnit para integracion CI

## Requisitos

- Node.js 18+ (recomendado LTS actual)
- npm 9+

## Instalacion

```bash
npm install
```

## Ejecucion local

```bash
npm run cy:open
```

```bash
npm run cy:run
```

```bash
npm run test:api
```

```bash
npm run test:smoke
```

```bash
npm run test:regression
```

## Ejecucion por tags

```bash
npm run test:tag:smoke
```

```bash
npm run test:tag:regression
```

Tags usados:

- Suite smoke: `@smoke`
- Suite regression: `@regression`

## CI con JUnit

```bash
npm run test:ci:pr
```

```bash
npm run test:ci:nightly
```

Resultados:

- PR filtra por `@smoke` y genera `results/junit/pr-[hash].xml`
- Nightly filtra por `@regression` y genera `results/junit/nightly-[hash].xml`

## Jenkins

El proyecto ya incluye `Jenkinsfile` para ejecutar por tags desde Jenkins.

Como usarlo en Jenkins:

1. Crear un Job tipo Pipeline (o Multibranch Pipeline).
2. Apuntar al repositorio `PokeAPI-Cypress`.
3. Ejecutar con el parametro `TEST_SUITE`:
- `smoke` para `@smoke`
- `regression` para `@regression`

Que hace el pipeline:

- `checkout scm`
- `npm ci`
- ejecuta Cypress con tag segun `TEST_SUITE`
- publica JUnit (`results/junit/*.xml`)
- archiva artifacts (`results/junit/*.xml`, `cypress/screenshots/**`, `cypress/videos/**`)

## Publicar en GitHub

1. Crea un repositorio vacio en tu cuenta GitHub.
2. Ejecuta desde la raiz del proyecto:

```powershell
.\scripts\connect-github.ps1 -RemoteUrl "https://github.com/<tu-usuario>/<tu-repo>.git"
```

Tambien puedes usar SSH:

```powershell
.\scripts\connect-github.ps1 -RemoteUrl "git@github.com:<tu-usuario>/<tu-repo>.git"
```

## Nota de entorno

Los scripts limpian automaticamente `ELECTRON_RUN_AS_NODE` antes de ejecutar Cypress.
Esto evita errores de inicio como `bad option: --smoke-test` en ambientes Windows donde esa variable esta definida globalmente.

## Estructura

- `cypress/e2e/api/smoke`: pruebas smoke
- `cypress/e2e/api/regression`: pruebas regression
- `cypress/support/e2e.js`: registro de `cy-grep`
- `cypress.config.js`: `baseUrl`, plugin de tags y env de filtrado
- `results/junit`: reportes XML de CI

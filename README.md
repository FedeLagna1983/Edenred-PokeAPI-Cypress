# PokeAPI Cypress

Automatizacion de pruebas API para [PokeAPI](https://pokeapi.co/) usando Cypress.

## Alcance

Este proyecto valida los escenarios del challenge:

- `GET /api/v2/berry/{id}` con id valido.
- `GET /api/v2/berry/{id}` con id invalido.
- `GET /api/v2/berry/{name}` con name valido.
- `GET /api/v2/berry/{name}` con name invalido.
- `GET /api/v2/berry-flavor/{name}` con flavor valido (`spicy`).
- Flujo encadenado para flavor `spicy`: obtener berries, seleccionar la de mayor `potency`, consultar la baya seleccionada y validar consistencia.

## Stack

- Cypress `13.17.0`
- `@bahmutov/cy-grep` para ejecucion por tags
- Node.js + npm
- Reporteria JUnit para CI

## Estructura

```text
cypress/
+-- e2e/
|   +-- api/
|       +-- smoke/       # pruebas criticas y rapidas
|       +-- regression/  # validaciones mas completas
+-- fixtures/            # datos de prueba versionados
+-- support/
    +-- api/             # cliente HTTP reutilizable
    +-- services/        # servicios por dominio/recurso
    +-- assertions/      # assertions reutilizables
    +-- e2e.js           # configuracion global Cypress
scripts/
+-- run-cypress.js       # runner cross-platform para limpiar ELECTRON_RUN_AS_NODE
```

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

- `@smoke`
- `@regression`

## CI con JUnit

```bash
npm run test:ci:pr
```

```bash
npm run test:ci:nightly
```

Resultados generados:

- PR: `results/junit/pr-[hash].xml`
- Nightly: `results/junit/nightly-[hash].xml`

La carpeta `results/` no se versiona porque contiene artefactos generados por ejecucion.

## Buenas practicas aplicadas

- Specs enfocadas en comportamiento, no en detalles de implementacion.
- Cliente API centralizado en `cypress/support/api`.
- Servicios por recurso en `cypress/support/services`.
- Assertions reutilizables en `cypress/support/assertions`.
- Datos de prueba en fixture JSON.
- Scripts npm cross-platform mediante `scripts/run-cypress.js`.
- Artefactos generados ignorados por Git.

## Jenkins

El proyecto incluye `Jenkinsfile` para ejecutar por tags desde Jenkins.

Parametro `TEST_SUITE`:

- `smoke` para `@smoke`
- `regression` para `@regression`

El pipeline ejecuta `npm ci`, corre Cypress por tag, publica JUnit y archiva artefactos.

# PokeAPI Cypress

Automatizacion de pruebas API para [PokeAPI](https://pokeapi.co/) usando Cypress.

## Alcance

Este proyecto valida escenarios API sobre endpoints `GET` del dominio Berry:

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

## Arquitectura

La suite esta organizada por recurso para escalar mejor en contexto enterprise. Cada recurso puede crecer con specs por metodo HTTP y tipo de suite.

```text
cypress/
+-- e2e/
|   +-- api/
|       +-- berry/
|           +-- berry.get.smoke.cy.js
|           +-- berry.get.regression.cy.js
+-- fixtures/
|   +-- pokeapi-test-data.json
+-- support/
    +-- api/
    |   +-- pokeapi.client.js
    +-- services/
    |   +-- berry.service.js
    +-- assertions/
    |   +-- http.assertions.js
    |   +-- berry.assertions.js
    +-- e2e.js
scripts/
+-- run-cypress.js
```

## Como escalar

Si se agrega un nuevo recurso:

```text
cypress/e2e/api/item/item.get.smoke.cy.js
cypress/e2e/api/item/item.get.regression.cy.js
cypress/support/services/item.service.js
cypress/support/assertions/item.assertions.js
```

Si se agregan metodos de escritura en un recurso:

```text
cypress/e2e/api/berry/berry.post.regression.cy.js
cypress/e2e/api/berry/berry.put.regression.cy.js
cypress/e2e/api/berry/berry.delete.regression.cy.js
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
npm run test:berry
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

- Specs organizadas por recurso y nombradas por metodo/suite.
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

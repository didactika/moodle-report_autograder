---
id: UC-004
name: narrowReport
title: Acotar el informe
status: draft
origin: code
sourceOfTruth: code
---

# UC-004 Acotar el informe — implementación

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../../requirements/use-case-overview.svg) | [Requisitos](../../../requirements/use-cases/narrowReport/README.md) | [Análisis](../../../analysis/use-cases/narrowReport/README.md) | [Diseño](../../../design/use-cases/narrowReport/README.md) | **Implementación** | [Pruebas](../../../implementation/use-cases/narrowReport/README.md#pruebas) |

Diseño: [README](../../../design/use-cases/narrowReport/README.md)

## Código

| Elemento | Tipo | Ubicación | Verificado |
| --- | --- | --- | --- |
| `filters` | clase | `classes/local/query/filters.php` | sí |
| `report_query` | clase | `classes/local/query/report_query.php` | sí |
| `search_filter_options` | servicio web | `classes/external/search_filter_options.php` | sí |
| Menús de filtro y el botón que los quita | módulo AMD | `amd/src/ui/toolbar.js`, `templates/partials/filters.mustache` | sí |
| Paginador | módulo AMD | `amd/src/ui/pagination.js`, `templates/pagination.mustache` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| Los recuentos de los estados, dentro de los filtros | flujo principal, RN-008 | `tests/external/get_report_test.php` |
| Las opciones de los selectores | flujo principal | `tests/external/search_filter_options_test.php` |

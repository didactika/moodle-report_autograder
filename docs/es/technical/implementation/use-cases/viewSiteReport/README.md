---
id: UC-002
name: viewSiteReport
title: Ver el informe del sitio
status: draft
origin: code
sourceOfTruth: code
---

# UC-002 Ver el informe del sitio — implementación

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../../requirements/use-case-overview.svg) | [Requisitos](../../../requirements/use-cases/viewSiteReport/README.md) | [Análisis](../../../analysis/use-cases/viewSiteReport/README.md) | [Diseño](../../../design/use-cases/viewSiteReport/README.md) | **Implementación** | [Pruebas](../../../implementation/use-cases/viewSiteReport/README.md#pruebas) |

Diseño: [README](../../../design/use-cases/viewSiteReport/README.md)

## Código

| Elemento | Tipo | Ubicación | Verificado |
| --- | --- | --- | --- |
| Página del informe | página | `index.php` | sí |
| `search_filter_options` | servicio web | `classes/external/search_filter_options.php` | sí |
| Barra de filtros | componentes React | `js/esm/src/components/` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| Las opciones de los selectores | flujo principal | `tests/external/search_filter_options_test.php` |
| La página del informe | flujo principal | `tests/page_test.php` |
| Recorrido Behat del informe | flujo principal | `tests/behat/report.feature` |

---
id: UC-001
name: viewReport
title: Ver el informe de una actividad o de un curso
status: draft
origin: code
sourceOfTruth: code
---

# UC-001 Ver el informe de una actividad o de un curso — implementación

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../../requirements/use-case-overview.svg) | [Requisitos](../../../requirements/use-cases/viewReport/README.md) | [Análisis](../../../analysis/use-cases/viewReport/README.md) | [Diseño](../../../design/use-cases/viewReport/README.md) | **Implementación** | [Pruebas](../../../implementation/use-cases/viewReport/README.md#pruebas) |

Diseño: [README](../../../design/use-cases/viewReport/README.md)

## Código

| Elemento | Tipo | Ubicación | Verificado |
| --- | --- | --- | --- |
| `get_report` | servicio web | `classes/external/get_report.php` | sí |
| Página del informe | página | `index.php` | sí |
| Chips de los estados | módulo AMD | `amd/src/ui/status_chips.js` | sí |
| Pantalla del informe | módulo AMD | `amd/src/ui/report.js` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| Una página de filas, filtros, orden y recuentos de los estados | flujo principal | `tests/external/get_report_test.php` |
| La consulta de las filas | flujo principal, RN-001 | `tests/local/report_query_test.php` |
| Grupos del lector | RN-004 | `tests/local/group_access_test.php` |
| Calificación y calificador provisionales | RN-005 | `tests/local/provisional_grade_test.php` |

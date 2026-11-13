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
| Tabla en una caja de una sola altura | componente React | `js/esm/src/components/ReportTable.tsx`, `js/esm/src/components/ui.tsx` (`TableBox`, `Empty`) | sí |
| Recorrido guiado | recorrido de usuario | `tours/report.json`, `lib.php` (`report_autograder_import_tours`), `db/install.php`, `db/upgrade.php` | sí |
| Ajuste que hace obligatorio el recorrido | ajuste | `settings.php` (`report_autograder/tourrequired`), `index.php` | sí |
| Pantalla del informe | componente React | `js/esm/src/Report.tsx` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| Una página de filas, filtros, orden y recuentos de los estados | flujo principal | `tests/external/get_report_test.php` |
| La consulta de las filas | flujo principal, RN-001 | `tests/local/report_query_test.php` |
| Grupos del lector | RN-004 | `tests/local/group_access_test.php` |
| Calificación y calificador provisionales | RN-005 | `tests/local/provisional_grade_test.php` |
| Recorrido Behat del informe | flujo principal | `tests/behat/report.feature` |

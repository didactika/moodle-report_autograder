---
id: UC-005
name: gradeFromReport
title: Calificar a un estudiante desde el informe
status: draft
origin: code
sourceOfTruth: code
---

# UC-005 Calificar a un estudiante desde el informe — implementación

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../../requirements/use-case-overview.svg) | [Requisitos](../../../requirements/use-cases/gradeFromReport/README.md) | [Análisis](../../../analysis/use-cases/gradeFromReport/README.md) | [Diseño](../../../design/use-cases/gradeFromReport/README.md) | **Implementación** | [Pruebas](../../../implementation/use-cases/gradeFromReport/README.md#pruebas) |

Diseño: [README](../../../design/use-cases/gradeFromReport/README.md)

## Código

| Elemento | Tipo | Ubicación | Verificado |
| --- | --- | --- | --- |
| `grader_ui` | clase | `classes/local/page/grader_ui.php` | sí |
| `row_formatter` | clase | `classes/local/format/row_formatter.php` | sí |
| Row template | archivo | `templates/table/_row.mustache` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| El recorrido behat del informe | flujo principal | `tests/behat/report.feature` |

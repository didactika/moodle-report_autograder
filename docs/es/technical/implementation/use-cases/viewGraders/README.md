---
id: UC-003
name: viewGraders
title: Ver quién calificaría cada curso
status: draft
origin: code
sourceOfTruth: code
---

# UC-003 Ver quién calificaría cada curso — implementación

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../../requirements/use-case-overview.svg) | [Requisitos](../../../requirements/use-cases/viewGraders/README.md) | [Análisis](../../../analysis/use-cases/viewGraders/README.md) | [Diseño](../../../design/use-cases/viewGraders/README.md) | **Implementación** | [Pruebas](../../../implementation/use-cases/viewGraders/README.md#pruebas) |

Diseño: [README](../../../design/use-cases/viewGraders/README.md)

## Código

| Elemento | Tipo | Ubicación | Verificado |
| --- | --- | --- | --- |
| Página de calificadores | página | `graders.php` | sí |
| Pantalla de calificadores | módulo AMD y plantilla | `amd/src/ui/graders.js`, `templates/graders.mustache` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| La lista de calificadores | flujo principal | `tests/local/grader_list_test.php` |
| El calificador que tendría un estudiante pendiente | RN-005 | `tests/local/prospective_grader_test.php` |

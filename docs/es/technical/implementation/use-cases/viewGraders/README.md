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
| `get_graders` | servicio web | `classes/external/get_graders.php` | sí |
| Página de calificadores | página | `graders.php` | sí |
| Pantalla de calificadores | componente React | `js/esm/src/Graders.tsx` | sí |

## Pruebas

| Prueba | Cubre | Ubicación |
| --- | --- | --- |
| Los calificadores de un curso | flujo principal | `tests/external/get_graders_test.php` |
| La lista de calificadores | flujo principal | `tests/local/grader_list_test.php` |
| El calificador que tendría un estudiante pendiente | RN-005 | `tests/local/prospective_grader_test.php` |

---
id: REQ
status: draft
origin: requirements
sourceOfTruth: model
---

# Requisitos

## Índice

- [Actores](./actors.md)
- [Catálogo de requisitos](./requirements.md)

## Casos de uso

| ID | Caso de uso | Actor | Paquete | Requisito | Análisis | Diseño | Implementación |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UC-001 | [Ver el informe de una actividad o de un curso](./use-cases/viewReport/README.md) | Docente | Lectura | RF-001 | [ficha](../analysis/use-cases/viewReport/README.md) | [ficha](../design/use-cases/viewReport/README.md) | [ficha](../implementation/use-cases/viewReport/README.md) |
| UC-002 | [Ver el informe del sitio](./use-cases/viewSiteReport/README.md) | Administrador | Lectura | RF-002 | [ficha](../analysis/use-cases/viewSiteReport/README.md) | [ficha](../design/use-cases/viewSiteReport/README.md) | [ficha](../implementation/use-cases/viewSiteReport/README.md) |
| UC-003 | [Ver quién calificaría cada curso](./use-cases/viewGraders/README.md) | Administrador | Lectura | RF-003 | [ficha](../analysis/use-cases/viewGraders/README.md) | [ficha](../design/use-cases/viewGraders/README.md) | [ficha](../implementation/use-cases/viewGraders/README.md) |
| UC-004 | [Acotar el informe](./use-cases/narrowReport/README.md) | Docente, Administrador | Lectura | RF-005 | [ficha](../analysis/use-cases/narrowReport/README.md) | [ficha](../design/use-cases/narrowReport/README.md) | [ficha](../implementation/use-cases/narrowReport/README.md) |
| UC-005 | [Calificar a un estudiante desde el informe](./use-cases/gradeFromReport/README.md) | Docente | Lectura | RF-006 | [ficha](../analysis/use-cases/gradeFromReport/README.md) | [ficha](../design/use-cases/gradeFromReport/README.md) | [ficha](../implementation/use-cases/gradeFromReport/README.md) |

### Diagrama de casos de uso

![Casos de uso](./use-case-overview.svg)

### Por actor

#### Docente

![Docente](./use-cases-teacher.svg)

#### Administrador

![Administrador](./use-cases-administrator.svg)

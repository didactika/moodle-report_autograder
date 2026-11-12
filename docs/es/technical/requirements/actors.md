---
id: ACT
status: draft
origin: code
sourceOfTruth: code
---

# Actores

| Actor | Tipo | Objetivo | Casos de uso relacionados |
| --- | --- | --- | --- |
| Docente | Primario | Seguir a los estudiantes de una actividad o de un curso y saber quién espera. Tiene `report/autograder:view` o `report/autograder:viewcourse`. | [UC-001](./use-cases/viewReport/README.md) |
| Administrador | Primario | Comprobar en todo el sitio que nada está bloqueado y preparar los cursos antes de que venza ninguna calificación. Tiene `report/autograder:viewsite`. | [UC-002](./use-cases/viewSiteReport/README.md), [UC-003](./use-cases/viewGraders/README.md) |
| Autograder | Secundario | Registra las decisiones y elige los calificadores que muestra el informe. | todos |
| Moodle | Secundario | Aporta las capacidades, los grupos, el libro de calificaciones y los servicios web en que se apoya el informe. | todos |

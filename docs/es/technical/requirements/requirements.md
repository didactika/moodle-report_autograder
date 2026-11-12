---
id: RQ
status: draft
origin: code
sourceOfTruth: code
---

# Catálogo de requisitos

## Funcionales

| ID | Requisito | Prioridad | Origen | Casos de uso |
| --- | --- | --- | --- | --- |
| RF-001 | Un docente puede leer el informe de una actividad o de un curso, buscar, filtrar y ordenarlo, y ver solo los grupos que puede ver. | Debe | `index.php`, `classes/external/get_report.php` | UC-001 |
| RF-002 | Un administrador puede leer el informe del sitio, que solo se ejecuta con un filtro. | Debe | `classes/local/query/filters.php` | UC-002 |
| RF-003 | Un administrador puede ver, para un curso, qué docentes podrían calificar y cuál recibiría cada estudiante. | Debería | `graders.php`, `classes/local/page/grader_list.php` | UC-003 |
| RF-004 | Las calificaciones fallidas y sus motivos solo se muestran a los lectores con la capacidad de ver los fallos. | Debe | `classes/local/format/status.php` | UC-001, UC-002 |
| RF-005 | Un lector puede acotar el informe por nombre, estado, grupo, fecha de calificación, actividad y curso, y ver cuántos estudiantes hay en cada estado. | Debe | `classes/local/query/filters.php`, `classes/external/search_filter_options.php` | UC-004 |
| RF-006 | Un docente puede pasar de una fila del informe a la pantalla de calificación de la actividad. | Debería | `classes/local/page/grader_ui.php` | UC-005 |

## No funcionales

| ID | Atributo de calidad | Requisito | Medida | Prioridad |
| --- | --- | --- | --- | --- |
| RNF-001 | Integridad | El informe solo lee. | las dos funciones de servicio web son `read` | Debe |
| RNF-002 | Seguridad | Cada nivel pide su propia capacidad. | `scope::require_capability` | Debe |
| RNF-003 | Rendimiento | El informe del sitio nunca se ejecuta sin filtros. | `filters` | Debe |
| RNF-004 | Privacidad | El plugin no almacena datos personales. | `classes/privacy/provider.php` (proveedor nulo) | Debe |

## Reglas de negocio

Las reglas están en el [diccionario del modelo de dominio](../domain/README.md#reglas-de-negocio). Las que cambian el comportamiento se repiten aquí con su ID.

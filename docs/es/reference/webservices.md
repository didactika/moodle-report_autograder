---
title: Servicios web
summary: Las funciones que alimentan las páginas del informe y qué lee cada una.
order: 41
---

Las páginas del informe leen sus datos mediante dos funciones de servicio web. Solo leen, están disponibles para las páginas de Moodle (AJAX) y exigen un usuario con sesión iniciada que tenga la capacidad del nivel que piden.

| Función | Lee | Parámetros |
|---|---|---|
| `report_autograder_get_report` | Una página del informe de una actividad, un curso o el sitio | `cmid`, `courseid`, `page`, `limit`, `filters` (una lista de nombre y valor), `sortcolumn`, `sortdir`, `withtotal` |
| `report_autograder_search_filter_options` | Las opciones de los selectores de curso y de actividad de la barra de filtros | `type` (curso o actividad), `query`, `cmid`, `courseid`, `filtercourseid` |

La página **Calificadores por curso** la dibuja el servidor y no necesita ningún servicio web.

## Filtros

Los filtros de `report_autograder_get_report` son pares de un nombre y un valor. Acotan la tabla a un texto de búsqueda, un periodo de fechas de calificación, uno o varios estados, un curso, una actividad o un grupo.

## Privacidad

El informe no almacena datos personales propios: lee los registros de Autograder, y la API de privacidad de Autograder los cubre.

---
id: UC-001
name: viewReport
title: Ver el informe de una actividad o de un curso
actor: Teacher
package: Reading
status: draft
origin: code
sourceOfTruth: code
requirement: RF-001
includes: 
extends: 
---

# UC-001 Ver el informe de una actividad o de un curso

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../use-case-overview.svg) | **Requisitos** | [Análisis](../../../analysis/use-cases/viewReport/README.md) | [Diseño](../../../design/use-cases/viewReport/README.md) | [Implementación](../../../implementation/use-cases/viewReport/README.md) | [Pruebas](../../../implementation/use-cases/viewReport/README.md#pruebas) |

## Información del caso de uso

| Campo | Valor |
| --- | --- |
| Actor | Docente |
| Paquete | Reading |
| Objetivo | Seguir a los estudiantes de una actividad o de un curso y saber quién espera. |
| Tipo | Primario, esencial |
| Nivel | Objetivo de usuario |
| Requisito | RF-001 |
| Entidades del dominio | ReportRow, Scope, Status, Filter, GroupAccess |

## Contexto

Un docente necesita ver, para cada estudiante, lo que Autograder decidió: el estado, la fecha de calificación, la calificación y quién la firma. El informe aparece donde el docente ya trabaja, en el menú de la actividad o del curso.

## Precondiciones

- El docente tiene `report/autograder:view` en la actividad, o `report/autograder:viewcourse` en el curso.
- Autograder está activado en la actividad, o en al menos una actividad del curso.

## Postcondiciones

- Éxito: la tabla muestra a los estudiantes que el docente puede ver, acotados por lo que eligió.
- Fallo: la página se niega a abrirse sin la capacidad.

## Flujo principal

| Paso | Actor | Sistema |
| --- | --- | --- |
| 1 | Abre **Informe de Autograder** en el menú de la actividad o del curso. | Comprueba la capacidad del nivel. |
| 2 |  | Lee la primera página de filas, limitada a los grupos que el docente puede ver. |
| 3 | Busca, filtra u ordena. | Vuelve a leer la página con los nuevos filtros. |
| 4 |  | Muestra cada fila con su estado, fecha, calificación y calificador; una fila pendiente muestra la calificación y el docente que tendría ahora; sobre las filas, el menú de los estados indica cuántos estudiantes hay en cada uno, contados dentro de los demás filtros; debajo, el paginador ofrece los tamaños de página que caben en la lista. |

## Flujos alternativos

| ID | Empieza en el paso | Condición | Comportamiento | Termina |
| --- | --- | --- | --- | --- |
| A1 | 1 | El docente no tiene la capacidad. | Rechaza la página. | Fin |
| A2 | 2 | La actividad tiene grupos separados. | Deja fuera a los estudiantes de los grupos que el docente no puede ver. | Paso 3 |
| A3 | 4 | El lector no puede ver los fallos. | Muestra a un estudiante con error como no autocalificado. | Paso 3 |
| A4 | 1 | Es la primera vez que el lector abre el informe de una actividad o de un curso. | Presenta el informe con un recorrido guiado de siete pasos; cuando el sitio exige el recorrido, este no tiene botón para omitirlo antes de su último paso. | Paso 2 |
| A5 | 4 | El lector pulsa el botón situado al final de una fila. | Abre el detalle de la fila en un diálogo: primero lo que falló, después el estado, la fecha de calificación y en qué se basa, la calificación y el día en que se registrará, y el calificador y cómo se elige. | Paso 3 |

## Reglas de negocio

| ID | Regla |
| --- | --- |
| RN-001 | Hay una fila por estudiante y actividad autocalificada. |
| RN-003 | Los fallos se muestran solo a los lectores que pueden verlos. |
| RN-004 | Un docente ve solo los grupos que puede ver. |
| RN-005 | Una fila pendiente muestra la calificación y el calificador provisionales. |
| RN-007 | Un estudiante al que las restricciones de acceso de la actividad dejan fuera no se enumera como sin entregar: no puede abrir la actividad, de modo que el informe no dice nada de él. |
| RN-009 | El paginador ofrece solo los tamaños de página menores que la lista, y Todos: hasta 12 filas, Todos; de 13 a 24, 12 y Todos; y así hasta 12, 24, 48, 96 y Todos. Una lista empieza con 12 filas; Todos se envía a los servicios como -1, que estos limitan. |
| RN-011 | La primera vez que una persona abre el informe de una actividad o de un curso, un recorrido guiado lo presenta; cuando el sitio lo exige, el recorrido no puede omitirse antes de su último paso. |
| RN-012 | El botón que abre el detalle de una fila toma el color de lo más grave que contiene: información, un problema que aún puede resolverse o una calificación con error. Una calificación que aún no está en el libro de calificaciones lleva la etiqueta Provisional, y una fila sin calificación muestra un guion. |
| RN-013 | Las columnas de la tabla conservan el ancho que tenían la primera vez que la tabla tuvo filas; un filtro, una ordenación u otra página nunca las mueven. Se miden de nuevo solo cuando cambia el ancho del recuadro de la tabla. |
| RN-016 | La caja de la tabla toma la altura que le deja la ventana bajo los filtros, menos el paginador, y al menos 18rem, de modo que en un ordenador los filtros, la tabla y el paginador caben en la ventana. Las líneas de las filas llegan al final de la caja y la última fila conserva su línea. |

## Especificación

Fuente de verdad del comportamiento: [specification.puml](./specification.puml)

![Especificación](./specification.svg)

## Prototipos

![Prototipos](./wireframes.svg)

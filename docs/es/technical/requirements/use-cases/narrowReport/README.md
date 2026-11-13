---
id: UC-004
name: narrowReport
title: Acotar el informe
actor: Teacher, Administrator
package: Reading
requirement: RF-005
includes: 
extends: 
status: draft
origin: code
sourceOfTruth: code
---

# UC-004 Acotar el informe

| Resumen | Requisitos | Análisis | Diseño | Implementación | Pruebas |
| --- | --- | --- | --- | --- | --- |
| [Casos de uso](../../use-case-overview.svg) | **Requisitos** | [Análisis](../../../analysis/use-cases/narrowReport/README.md) | [Diseño](../../../design/use-cases/narrowReport/README.md) | [Implementación](../../../implementation/use-cases/narrowReport/README.md) | [Pruebas](../../../implementation/use-cases/narrowReport/README.md#pruebas) |

## Información del caso de uso

| Campo | Valor |
| --- | --- |
| Actor | Docente, Administrador |
| Paquete | Reading |
| Objetivo | Encontrar en el informe a los estudiantes que importan por nombre, estado, grupo, fecha de calificación, actividad o curso. |
| Tipo | Primario, esencial |
| Nivel | Objetivo de usuario |
| Requisito | RF-005 |
| Entidades del dominio | Filter, Status, ReportRow, GroupAccess |

## Contexto

Un informe puede enumerar miles de filas. La barra de herramientas lo acota con la búsqueda y un menú para cada filtro; el menú de los estados indica cuántos estudiantes hay en cada estado, contados dentro de todos los demás filtros, de modo que los números suman las filas que mostraría el informe.

## Precondiciones

- El lector ha abierto un informe y tiene su capacidad.

## Postcondiciones

- Éxito: la tabla muestra a los estudiantes que coinciden, con el total y el número de cada estado.
- Fallo: un filtro no válido se ignora y el informe conserva lo que mostraba.

## Flujo principal

| Paso | Actor | Sistema |
| --- | --- | --- |
| 1 | Escribe un nombre, o elige en sus menús uno o varios estados, un grupo, un periodo de fechas de calificación, una actividad o un curso. | Para la actividad y el curso, busca las opciones mientras se escribe, entre las que el lector puede ver. |
| 2 |  | Pide de nuevo la primera página con los filtros, el total y los estudiantes de cada estado. |
| 3 |  | Muestra las filas, el total y el recuento de cada estado, resalta los menús que acotan el informe y pone una cruz en lugar de su flecha. |
| 4 | Pulsa la cruz de un menú, o el botón que quita todos los filtros. | Levanta ese filtro, o todos, y vuelve a mostrar el informe desde su primera página. |

## Flujos alternativos

| ID | Empieza en el paso | Condición | Comportamiento | Termina |
| --- | --- | --- | --- | --- |
| A1 | 2 | El informe es el del sitio y el lector no lo ha acotado. | Pide un filtro antes de ejecutarse. | Paso 1 |
| A2 | 2 | El lector no puede ver los fallos. | No ofrece el estado de los estudiantes con error y los cuenta como no autocalificados. | Paso 3 |
| A3 | 3 | Un estado no tiene estudiantes. | Lo ofrece con un recuento de cero. | Paso 4 |

## Reglas de negocio

| ID | Regla |
| --- | --- |
| RN-008 | El recuento de cada estado se calcula dentro de todos los demás filtros salvo el propio estado, de modo que elegir un estado no oculte los números de los demás. |
| RN-009 | El paginador ofrece solo los tamaños de página menores que la lista, y Todos: hasta 12 filas, Todos; de 13 a 24, 12 y Todos; y así hasta 12, 24, 48, 96 y Todos. Una lista empieza con 12 filas; Todos se envía a los servicios como -1, que estos limitan. |
| RN-010 | Cada filtro es un menú que nunca ofrece su estado base como opción; al elegir un valor, el menú se resalta y una cruz ocupa el lugar de su flecha para quitarlo. Un botón al final de la fila quita todos los filtros. Un menú elegido muestra solo su valor, o el nombre del filtro y cuántos valores hay elegidos. |
| RN-014 | La fila de filtros nunca se divide en dos líneas: cuando los menús no caben junto a la búsqueda (10 rem), se reúnen en un único menú, Filtros, con el icono del embudo y el número de filtros en uso, y se separan de nuevo cuando hay espacio. Un valor largo se corta con puntos suspensivos antes de la cruz de su menú. |
| RN-015 | Un periodo de fechas de calificación nunca queda al revés: un primer día elegido después del último mueve el último hasta él, y un último día elegido antes del primero mueve el primero hasta él. |
| RN-002 | El informe del sitio no se ejecuta sin un filtro. |
| RN-003 | Los fallos se muestran solo a los lectores que pueden verlos. |
| RN-004 | Un docente ve solo los grupos que puede ver. |

## Especificación

Fuente de verdad del comportamiento: [specification.puml](./specification.puml)

![Especificación](./specification.svg)

## Prototipos

![Prototipos](./wireframes.svg)

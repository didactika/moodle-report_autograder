---
title: Solución de problemas
summary: Qué comprobar cuando algo no funciona como se espera.
order: 70
---

| Problema | Causa posible |
|---|---|
| El informe no está en el menú de la actividad ni en el del curso | Autograder no está activado en esa actividad, ni en ninguna actividad del curso, o no tiene la capacidad de ese nivel |
| Un estudiante pendiente muestra a nadie como calificador | Ninguno de los docentes del estudiante puede calificar la actividad o ver el grupo del estudiante, y no hay calificador de reserva configurado en Autograder |
| Falta un estudiante en el informe | No está matriculado de forma activa con un rol que el libro de calificaciones califique, o, en una actividad con grupos separados, no está en uno de sus grupos |
| El informe del sitio pide un filtro | Es lo esperado: elija un curso, una actividad u otro filtro |
| Un estudiante aparece como **No autocalificado** y un gestor ve **Con error** | Las calificaciones fallidas y sus motivos solo se muestran a los usuarios que tienen `report/autograder:viewfailed` |

---
title: Ajustes
summary: El ajuste del informe y lo que cambia.
order: 42
---

El informe tiene un ajuste, en **Administración del sitio > Informes > Informe de Autograder > Ajustes del informe**. Se necesita la capacidad `moodle/site:config`.

| Ajuste | Valor predeterminado | Qué hace |
|---|---|---|
| Hacer obligatorio el recorrido guiado (`report_autograder/tourrequired`) | Desactivado | Cuando está activado, el [recorrido guiado](page:guides/guided-tour) del informe de una actividad y de un curso no puede omitirse: sus pasos no tienen el botón **Omitir recorrido** y el recorrido termina en su último paso. Cuando está desactivado, el recorrido puede omitirse en cualquier paso. |

Todo lo demás que decide lo que muestra el informe se configura en Autograder y en las capacidades del informe (consulte [Capacidades](page:reference/capabilities)).

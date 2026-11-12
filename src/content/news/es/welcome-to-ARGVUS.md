---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Te damos la bienvenida a ARGVUS
description: Descubre ARGVUS, un entorno de escritorio modular para Arch Linux
  basado en Wayland y Hyprland, con ajustes, apariencia, herramientas de sesión
  y aplicaciones integradas.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---


Hoy presentamos **ARGVUS**: un entorno de escritorio modular para **Arch Linux**, diseñado para **Wayland** e impulsado por **Hyprland**.

ARGVUS reúne las distintas partes de un escritorio de Linux: inicio de sesión y arranque de sesión, ventanas y áreas de trabajo, una barra de tareas y un panel de control rápido, ajustes, temas, notificaciones, pantallas, energía, redes y aplicaciones cotidianas. Estas partes se organizan como paquetes enfocados que comparten un modelo de configuración común, de modo que el escritorio se siente como un solo sistema sin llegar a ser un programa monolítico.

> **En resumen:** Arch Linux es el sistema operativo, Hyprland es el compositor de Wayland y ARGVUS coordina la sesión y la experiencia de escritorio en torno a ellos.

## Un escritorio hecho de partes que cooperan

La sesión de ARGVUS sigue un camino claro desde el inicio de sesión hasta el escritorio:

```text
Inicio de sesión o TTY
    ↓
Sesión de ARGVUS → Hyprland
    ↓
Barra de tareas · Panel de control · Notificaciones · Fondo de pantalla · Servicios de inactividad
```

El gestor de sesión inicia y supervisa los servicios del escritorio. Hyprland gestiona las ventanas, las áreas de trabajo y los monitores. La barra de tareas, el Panel de control, la aplicación de ajustes y los paquetes de servicios enfocados proporcionan las superficies con las que interactúas todos los días.

| Área | Lo que aporta a tu escritorio |
| --- | --- |
| **Inicio de sesión y sesiones** | Un greeter de ARGVUS, inicio de sesión gráfico, arranque desde TTY y servicios de usuario gestionados. |
| **Ventanas y áreas de trabajo** | Una configuración de Hyprland con atajos de teclado, diseños (layouts), gestión de monitores y ajustes de apariencia compartidos. |
| **Barra de tareas** | Una barra basada en Waybar para áreas de trabajo, ventanas y estado del sistema, con widgets opcionales. |
| **Panel de control** | Una interfaz en Quickshell para acciones rápidas, controles de sesión y energía, y widgets de escritorio. |
| **Centro de control** | Una aplicación de ajustes orientada al teclado para la configuración y administración del escritorio. |
| **Servicios de escritorio** | Integraciones enfocadas para pantallas, redes, Bluetooth, energía, notificaciones, cortafuegos y almacenamiento extraíble. |

Cada componente posee sus propios comandos y comportamiento de servicio. Ese diseño modular permite mantener o mejorar una parte sin convertir todo el escritorio en una única aplicación fuertemente acoplada.

## Ajustes que funcionan juntos

Cambiar un ajuste debería tener un efecto predecible en todo el escritorio. ARGVUS almacena el estado de apariencia y preferencias de forma centralizada y luego lo aplica a los componentes que lo utilizan. El Centro de control ofrece un lugar guiado para ajustar los parámetros; las herramientas de línea de comandos están disponibles cuando prefieres la terminal.

Por ejemplo, un cambio de tema puede actualizar juntos el compositor, las aplicaciones GTK y Qt, la barra de tareas, el Panel de control, el lanzador, las notificaciones y la pantalla de bloqueo. También puedes elegir un color de acento y un estilo de diseño:

| Estilo | Sensación |
| --- | --- |
| **Sticky** | Espaciado compacto y un ajuste más cercano entre las ventanas y las superficies del escritorio. |
| **Spaced** | Espacios más grandes, esquinas redondeadas, sombras y más espacio para respirar alrededor del shell. |

El sistema visual incluye **23 familias de temas**, cada una disponible en ambos estilos, junto con fondos de pantalla, fuentes, temas de iconos y efectos configurables. Elige un aspecto predefinido o ajusta el color de acento para hacerlo tuyo.

> **Una distinción útil:** tus preferencias seleccionadas son la fuente de verdad. Los archivos generados para componentes individuales del escritorio son proyecciones de ese estado compartido, por lo que debes realizar los cambios a través de los ajustes de ARGVUS o mediante los comandos compatibles en lugar de editar el resultado generado.

## Herramientas útiles, ya conectadas

ARGVUS incluye o integra una serie de pequeñas comodidades para que las tareas comunes estén al alcance de la mano:

- **Lanzador de aplicaciones:** presiona `SUPER + D` para buscar aplicaciones gráficas instaladas. Menús de teclado adicionales pueden abrir proyectos, hosts SSH, fragmentos de código (snippets), emojis, una calculadora y hojas de atajos (cheatsheets).
- **Controles de pantalla:** inspecciona monitores y ajusta configuraciones como resolución, tasa de refresco, escala, posición u orientación cuando el compositor activo y el hardware lo admitan.
- **Acciones de energía y sesión:** usa el Panel de control para acciones inmediatas como bloquear, suspender, cerrar sesión o apagar. Configura el comportamiento persistente de inactividad y pantalla en el Centro de control.
- **No molestar:** controla la entrega de notificaciones desde el Panel de control; las notificaciones recibidas mientras está activo se guardan para más tarde.
- **Dispositivos extraíbles:** accede a acciones de almacenamiento desde menús integrados y la barra de tareas.
- **ARGVUS Focus:** ejecuta sesiones de enfoque estilo Pomodoro, descansos y notificaciones, con un historial local.
- **ARGVUS Clock:** usa relojes mundiales, un cronómetro, temporizadores y alarmas, con funciones como posponer y reportes de alarmas perdidas.
- **Herramientas de terminal:** abre perfiles de terminal configurados, un monitor del sistema y otras aplicaciones TUI integradas.

Algunas funciones son paquetes opcionales. Por ejemplo, las integraciones con agentes de programación y los juegos se pueden añadir sin convertirlos en partes obligatorias de la sesión base. Las integraciones de IA inician el agente seleccionado en una terminal; ARGVUS no crea cuentas ni configura claves API o suscripciones por ti.

## Empieza en Arch Linux

En una instalación limpia de Arch Linux, el inicio rápido documentado es:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

El instalador configura el repositorio de paquetes de ARGVUS e instala el paquete `argvus` con sus dependencias. Luego, cierra sesión y elige **ARGVUS** en tu gestor de pantalla, o inicia una sesión de ARGVUS desde una TTY.

```sh
# Abre el Centro de control
argvus --control-center

# Vuelve a abrir la guía de configuración inicial en cualquier momento
argvus welcome
```

ARGVUS está diseñado para **Arch Linux**, **Wayland** y **Hyprland**; no es una distribución de Linux independiente. Consulta la [guía de instalación](https://argvus.github.io/docs/getting-started/installation/) para conocer los requisitos, la configuración manual y los detalles actuales de los paquetes antes de instalar.

## Explora ARGVUS

Empieza con la [documentación para el usuario](https://argvus.github.io/docs/intro/) para la configuración y el uso diario, o explora el [repositorio de código fuente de ARGVUS](https://github.com/argvus/argvus) y la [organización de ARGVUS en GitHub](https://github.com/argvus/) para descubrir sus componentes individuales.

Te damos la bienvenida a un escritorio que es modular por dentro y coordinado donde importa. **Te damos la bienvenida a ARGVUS.**

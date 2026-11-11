---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Bem-vindo ao ARGVUS
description: Conheça o ARGVUS, um ambiente de trabalho modular para Arch Linux
  construído sobre Wayland e Hyprland, com definições integradas, aparência,
  ferramentas de sessão e aplicações.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---

# Bem-vindo ao ARGVUS

Hoje, apresentamos o **ARGVUS**: um ambiente de trabalho modular para **Arch Linux**, construído para o **Wayland** e impulsionado pelo **Hyprland**.

O ARGVUS reúne as várias partes de um ambiente de trabalho Linux: início de sessão e arranque da sessão, janelas e áreas de trabalho, uma barra de tarefas e painel de controlo rápido, definições, temas, notificações, ecrãs, energia, rede e aplicações do dia a dia. Estas partes estão organizadas como pacotes focados que partilham um modelo de configuração comum, para que o ambiente de trabalho pareça um único sistema sem ser um programa monolítico.

> **Em resumo:** O Arch Linux é o sistema operativo, o Hyprland é o compositor Wayland e o ARGVUS coordena a sessão e a experiência de ambiente de trabalho em torno deles.

## Um ambiente de trabalho feito de partes cooperantes

A sessão do ARGVUS tem um caminho claro desde o início de sessão até ao ambiente de trabalho:

```text
Início de sessão ou TTY
    ↓
Sessão ARGVUS → Hyprland
    ↓
Barra de tarefas · Painel de Controlo · Notificações · Fundo de ecrã · Serviços de inatividade
```

O gestor de sessão inicia e supervisiona os serviços do ambiente de trabalho. O Hyprland gere janelas, áreas de trabalho e monitores. A barra de tarefas, o Painel de Controlo, a aplicação de definições e os pacotes de serviços focados fornecem as interfaces com as quais interage todos os dias.

| Área | O que traz ao seu ambiente de trabalho |
| --- | --- |
| **Início de sessão e sessões** | Um ecrã de boas-vindas (greeter) ARGVUS, início de sessão gráfico, arranque por TTY e serviços de utilizador geridos. |
| **Janelas e áreas de trabalho** | Uma configuração do Hyprland com atalhos de teclado, esquemas (layouts), gestão de monitores e definições de aparência partilhadas. |
| **Barra de tarefas** | Uma barra baseada em Waybar para áreas de trabalho, janelas e estado do sistema, com widgets opcionais. |
| **Painel de Controlo** | Uma interface Quickshell para ações rápidas, controlo de sessão e energia, e widgets de ambiente de trabalho. |
| **Centro de Controlo** | Uma aplicação de definições orientada para o teclado para configuração e administração do ambiente de trabalho. |
| **Serviços de ambiente de trabalho** | Integrações focadas para ecrãs, redes, Bluetooth, energia, notificações, firewall e armazenamento removível. |

Cada componente gere os seus próprios comandos e comportamento de serviço. Esse design modular torna possível manter ou melhorar uma parte sem transformar todo o ambiente de trabalho numa única aplicação fortemente acoplada.

## Definições que funcionam em conjunto

Alterar uma definição deve ter um efeito previsível em todo o ambiente de trabalho. O ARGVUS armazena o estado de aparência e preferências centralmente, aplicando-o depois aos componentes que o utilizam. O Centro de Controlo oferece um local guiado para ajustar as definições; as ferramentas de linha de comandos estão disponíveis se preferir o terminal.

Por exemplo, a alteração de um tema pode atualizar em conjunto o compositor, as aplicações GTK e Qt, a barra de tarefas, o Painel de Controlo, o lançador, as notificações e o ecrã de bloqueio. Também pode escolher uma cor de acento e um estilo de esquema (layout):

| Estilo | Sensação |
| --- | --- |
| **Sticky** | Espaçamento compacto e um ajuste mais próximo entre janelas e superfícies do ambiente de trabalho. |
| **Spaced** | Espaços maiores, cantos arredondados, sombras e mais espaço livre em redor da shell. |

O sistema visual inclui **23 famílias de temas**, cada uma disponível em ambos os estilos, a par de fundos de ecrã, tipos de letra, temas de ícones e efeitos configuráveis. Escolha um aspeto pré-definido ou ajuste a cor de acento para o tornar seu.

> **Uma distinção útil:** as suas preferências selecionadas são a fonte da verdade. Os ficheiros gerados para componentes individuais do ambiente de trabalho são projeções desse estado partilhado, pelo que deve fazer alterações através das definições do ARGVUS ou de comandos suportados em vez de editar o resultado gerado.

## Ferramentas úteis, já ligadas

O ARGVUS inclui ou integra um conjunto de pequenas conveniências para que as tarefas comuns estejam sempre à mão:

- **Lançador de aplicações:** prima `SUPER + D` para encontrar as aplicações gráficas instaladas. Menus de teclado adicionais podem abrir projetos, anfitriões SSH, fragmentos de código (snippets), emojis, uma calculadora e folhas de consulta rápida (cheatsheets).
- **Controlos de ecrã:** inspecione monitores e ajuste definições como resolução, taxa de atualização, escala, posição e orientação quando o compositor ativo e o hardware os suportarem.
- **Ações de energia e sessão:** utilize o Painel de Controlo para ações imediatas como bloquear, suspender, terminar sessão ou encerrar. Configure o comportamento persistente de inatividade e de ecrã no Centro de Controlo.
- **Não Incomodar:** controle a entrega de notificações a partir do Painel de Controlo; as notificações recebidas enquanto este estiver ativo são guardadas para mais tarde.
- **Dispositivos removíveis:** aceda a ações de armazenamento a partir dos menus integrados e das superfícies da barra de tarefas.
- **ARGVUS Focus:** execute sessões de foco ao estilo Pomodoro, pausas e notificações, com um histórico local.
- **ARGVUS Clock:** utilize relógios mundiais, um cronómetro, temporizadores e alarmes, incluindo repetição de alarme (snooze) e relatórios de alarmes perdidos.
- **Ferramentas de terminal:** abra perfis de terminal configurados, um monitor de sistema e outras aplicações TUI integradas.

Algumas funcionalidades são pacotes opcionais. Por exemplo, integrações de agentes de programação e jogos podem ser adicionados sem os tornar partes obrigatórias da sessão base. As integrações de IA iniciam o agente selecionado num terminal; o ARGVUS não cria contas nem configura chaves de API ou subscrições por si.

## Começar no Arch Linux

Numa instalação recente do Arch Linux, o arranque rápido documentado é:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

O instalador configura o repositório de pacotes do ARGVUS e instala o pacote `argvus` com as suas dependências. Em seguida, termine a sessão e escolha **ARGVUS** no seu gestor de ecrã (display manager), ou inicie uma sessão ARGVUS a partir de um TTY.

```sh
# Abrir o Centro de Controlo
argvus --control-center

# Reabrir o guia de configuração inicial a qualquer altura
argvus welcome
```

O ARGVUS é feito para **Arch Linux**, **Wayland** e **Hyprland**; não é uma distribuição Linux independente. Consulte o [guia de instalação](https://argvus.github.io/docs/getting-started/installation/) para verificar os requisitos, a configuração manual e os detalhes atuais dos pacotes antes de instalar.

## Explorar o ARGVUS

Comece com a [documentação do utilizador](https://argvus.github.io/docs/intro/) para a configuração e utilização diária, ou explore o [repositório de código do ARGVUS](https://github.com/argvus/argvus) e a [organização ARGVUS no GitHub](https://github.com/argvus/) para descobrir componentes individuais.

Bem-vindo a um ambiente de trabalho que é modular por dentro e coordenado onde importa. **Bem-vindo ao ARGVUS.**

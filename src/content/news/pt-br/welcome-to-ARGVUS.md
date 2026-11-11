---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Boas-vindas ao ARGVUS
description: Conheça o ARGVUS, um ambiente de trabalho modular para Arch Linux
  construído sobre o Wayland e o Hyprland, com configurações, aparência,
  ferramentas de sessão e aplicativos integrados.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---

# Boas-vindas ao ARGVUS

Hoje, estamos apresentando o **ARGVUS**: um ambiente de trabalho modular para o **Arch Linux**, construído para o **Wayland** e impulsionado pelo **Hyprland**.

O ARGVUS reúne as partes de um ambiente de trabalho Linux: login e inicialização de sessão, janelas e espaços de trabalho (workspaces), uma barra de tarefas e painel de controle rápido, configurações, temas, notificações, telas, energia, rede e aplicativos do dia a dia. Essas partes são organizadas em pacotes focados que compartilham um modelo de configuração comum, para que o ambiente de trabalho pareça um único sistema sem ser um programa monolítico.

> **Em resumo:** O Arch Linux é o sistema operacional, o Hyprland é o compositor Wayland e o ARGVUS coordena a sessão e a experiência do ambiente de trabalho em torno deles.

## Um ambiente de trabalho feito de partes cooperativas

A sessão do ARGVUS possui um caminho claro do login ao ambiente de trabalho:

```text
Login ou TTY
    ↓
Sessão do ARGVUS → Hyprland
    ↓
Barra de tarefas · Painel de Controle · Notificações · Papel de parede · Serviços de inatividade
```

O gerenciador de sessão inicia e supervisiona os serviços do ambiente de trabalho. O Hyprland gerencia janelas, espaços de trabalho e monitores. A barra de tarefas, o Painel de Controle, o aplicativo de configurações e os pacotes de serviços focados fornecem as superfícies com as quais você interage todos os dias.

| Área | O que traz para o seu ambiente de trabalho |
| --- | --- |
| **Login e sessões** | Um greeter do ARGVUS, login gráfico, inicialização via TTY e serviços de usuário gerenciados. |
| **Janelas e espaços de trabalho** | Uma configuração do Hyprland com atalhos de teclado, layouts, gerenciamento de monitores e configurações de aparência compartilhadas. |
| **Barra de tarefas** | Uma barra baseada no Waybar para espaços de trabalho, janelas e status do sistema, com widgets opcionais. |
| **Painel de Controle** | Uma superfície do Quickshell para ações rápidas, controles de sessão e energia, e widgets de área de trabalho. |
| **Central de Controle** | Um aplicativo de configurações focado em teclado para configuração e administração do ambiente de trabalho. |
| **Serviços de área de trabalho** | Integrações focadas para telas, redes, Bluetooth, energia, notificações, firewall e armazenamento removível. |

Cada componente possui seus próprios comandos e comportamento de serviço. Esse design modular torna possível manter ou melhorar uma parte sem transformar todo o ambiente de trabalho em um único aplicativo fortemente acoplado.

## Configurações que funcionam juntas

Alterar uma configuração deve ter um efeito previsível em todo o ambiente de trabalho. O ARGVUS armazena o estado de aparência e preferências de forma centralizada e, em seguida, o aplica aos componentes que o utilizam. A Central de Controle oferece um local guiado para ajustar configurações; ferramentas de linha de comando estão disponíveis caso você prefira o terminal.

Por exemplo, uma mudança de tema pode atualizar o compositor, os aplicativos GTK e Qt, a barra de tarefas, o Painel de Controle, o lançador, as notificações e a tela de bloqueio juntos. Você também pode escolher uma cor de destaque e um estilo de layout:

| Estilo | Sensação |
| --- | --- |
| **Sticky** | Espaçamento compacto e um ajuste mais próximo entre janelas e superfícies da área de trabalho. |
| **Spaced** | Espaços maiores, cantos arredondados, sombras e mais espaço de respiro ao redor da shell. |

O sistema visual inclui **23 famílias de temas**, cada uma disponível em ambos os estilos, além de papéis de parede, fontes, temas de ícones e efeitos configuráveis. Escolha um visual pronto ou ajuste a cor de destaque para deixá-lo com a sua cara.

> **Uma distinção útil:** suas preferências selecionadas são a fonte da verdade. Arquivos gerados para componentes individuais do ambiente de trabalho são projeções desse estado compartilhado, portanto, faça alterações por meio das configurações do ARGVUS ou por comandos suportados, em vez de editar diretamente os arquivos gerados.

## Ferramentas úteis, já conectadas

O ARGVUS inclui ou integra uma variedade de pequenas conveniências para que tarefas comuns estejam sempre à mão:

- **Lançador de aplicativos:** pressione `SUPER + D` para encontrar aplicativos gráficos instalados. Menus de teclado adicionais podem abrir projetos, hosts SSH, snippets, emojis, uma calculadora e folhas de cola (cheatsheets).
- **Controles de tela:** inspecione monitores e ajuste configurações como resolução, taxa de atualização, escala, posição e orientação quando o compositor ativo e o hardware oferecerem suporte.
- **Ações de energia e sessão:** use o Painel de Controle para ações imediatas, como bloquear, suspender, encerrar a sessão ou desligar. Configure comportamentos persistentes de inatividade e tela na Central de Controle.
- **Não Perturbe:** controle a entrega de notificações a partir do Painel de Controle; as notificações recebidas enquanto ele estiver ativo serão guardadas para mais tarde.
- **Dispositivos removíveis:** acesse ações de armazenamento a partir de menus integrados e superfícies da barra de tarefas.
- **ARGVUS Focus:** execute sessões de foco no estilo Pomodoro, pausas e notificações, com um histórico local.
- **ARGVUS Clock:** use relógios mundiais, cronômetro, temporizadores e alarmes, incluindo a função soneca e relatórios de alarmes perdidos.
- **Ferramentas de terminal:** abra perfis de terminal configurados, um monitor de sistema e outros aplicativos TUI integrados.

Alguns recursos são pacotes opcionais. Por exemplo, integrações com agentes de programação e jogos podem ser adicionados sem se tornarem partes obrigatórias da sessão base. Integrações de IA iniciam o agente selecionado em um terminal; o ARGVUS não cria contas nem configura chaves de API ou assinaturas para você.

## Comece a usar no Arch Linux

Em uma instalação limpa do Arch Linux, o início rápido documentado é:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

O instalador configura o repositório de pacotes do ARGVUS e instala o pacote `argvus` com suas dependências. Em seguida, encerre a sessão e escolha **ARGVUS** no seu gerenciador de exibição (display manager), ou inicie uma sessão do ARGVUS a partir de um TTY.

```sh
# Abre a Central de Controle
argvus --control-center

# Reabra o guia de primeira configuração a qualquer momento
argvus welcome
```

O ARGVUS foi feito para **Arch Linux**, **Wayland** e **Hyprland**; ele não é uma distribuição Linux independente. Verifique o [guia de instalação](https://argvus.github.io/docs/getting-started/installation/) para pré-requisitos, configuração manual e detalhes atuais dos pacotes antes de instalar.

## Explore o ARGVUS

Comece pela [documentação do usuário](https://argvus.github.io/docs/intro/) para configuração e uso diário, ou explore o [repositório de código do ARGVUS](https://github.com/argvus/argvus) e a [organização ARGVUS no GitHub](https://github.com/argvus/) para descobrir componentes individuais.

Boas-vindas a um ambiente de trabalho que é modular por baixo do capô e coordenado onde realmente importa. **Boas-vindas ao ARGVUS.**

---
name: news-translations
description: Translate an ARGVUS news post into every non-English language configured in this project when asked with prompt:<slug>.md.
---

# Tradução de postagens de notícias

Use esta skill quando a solicitação for `prompt:<slug>.md`, como `prompt:welcome-to-ARGVUS.md`, ou quando o usuário pedir a tradução de uma postagem de `src/content/news`.

## Fluxo

1. Extraia o nome do arquivo da solicitação e leia `src/content/news/<slug>.md`. O diretório correto é `news` (não `new`). Se o arquivo de origem não existir, informe isso e não invente conteúdo.
2. Leia `src/lib/site-languages.json`. Traduza para cada idioma listado, exceto `en`; use o campo `code` como nome do diretório e `label` como idioma de destino. Não mantenha uma lista de idiomas duplicada nesta skill.
3. Para cada idioma, crie `src/content/news/<code>/<slug>.md`. Crie os diretórios necessários. Se o arquivo de destino já existir, preserve-o sem alterações e prossiga com os demais idiomas.
4. Traduza o título, a descrição e todo o texto editorial do corpo. Preserve o significado, os fatos e o tom do original; use a variante regional indicada pelo idioma (especialmente `pt-br` e `pt-pt`).
5. Preserve a estrutura e os elementos técnicos: front matter YAML válido, cabeçalhos, listas, tabelas, citações, links, HTML, imagens, blocos de código, comandos, nomes de produtos, identificadores e tags. Não traduza nomes próprios, marcas, comandos, URLs, caminhos ou identificadores de código. Mantenha autor, link do autor, data e tags iguais ao original; traduza somente `title`, `description` e texto editorial.
6. Não resuma, acrescente fatos ou remova conteúdo. Mantenha parágrafos e a ordem das seções alinhados com a origem. Preserve quebras de linha e formatação Markdown sempre que possível.
7. Ao concluir, informe o post de origem, os arquivos criados e os idiomas cujos destinos já existiam. Não altere outros arquivos do projeto.

## Verificação

- Confirme que cada arquivo criado tem front matter delimitado por `---` e inclui `author`, `title`, `description`, `date` e `tags`.
- Compare a estrutura Markdown e os elementos preservados com a origem.
- Não execute comandos de tradução por API nem scripts que possam modificar outros posts; faça somente os arquivos correspondentes ao slug solicitado.


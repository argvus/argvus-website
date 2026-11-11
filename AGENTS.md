# Instruções para agentes

## Tradução de postagens de notícias

Quando a solicitação corresponder a `prompt:<slug>.md` (por exemplo, `prompt:welcome-to-ARGVUS.md`), trate-a como uma solicitação para traduzir a postagem `src/content/news/<slug>.md` para os idiomas disponíveis neste projeto.

- Leia `.agents/skills/news-translations/SKILL.md` e siga o fluxo descrito ali.
- Use `src/content/news/` como diretório correto das postagens em inglês. O caminho pode aparecer como `src/content/new/` por engano em solicitações; confirme o arquivo em `news/`.
- Consulte `src/lib/site-languages.json` para obter a lista atual de idiomas e seus códigos. Traduza para todos os idiomas listados, exceto `en`.
- Crie cada arquivo em `src/content/news/<codigo>/<slug>.md`. Preserve traduções existentes; não as substitua.


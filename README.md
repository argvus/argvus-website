# ARGVUS documentation

This project contains the Astro/Starlight documentation website for ARGVUS.

The documentation is organized by user-facing capabilities and developer subsystem boundaries:

- `src/content/docs/docs/user-guide/` — installation and daily use;
- `src/content/docs/docs/reference/` — commands, files, services and packages;
- `src/content/docs/docs/developer-guide/` — architecture and contribution guidance;
- `src/content/docs/pt/docs/` — the Portuguese mirror.

The authoritative implementation is in the sibling repositories under `de/`.
When source code, package manifests or installed service definitions disagree
with documentation, update the documentation from the implementation.

## Commands

Show the complete list of project commands and their descriptions with:

```sh
npm run help
```

The help output is generated from the scripts in `package.json`, so it includes
the site, documentation, post-management and utility commands available through
`npm run`.

```sh
npm run dev
npm run build
npm run preview
```

## News posts

Write English posts in `src/content/news/<slug>.md`. Create a scaffold with:

```sh
npm run create:post
# Or pass the title directly:
npm run create:post -- "A New Release"
```

Without a title argument, the command prompts for one. It stores the title in the
front matter and creates a URL-safe slug from it: lowercase, without accents,
and with spaces and punctuation converted to hyphens. Run
`npm run translate:posts` to choose one English post from an interactive menu,
translate all posts, or cancel. Each selected post is translated to the site's
other 17 locales. The menu only lists posts with at least one missing locale;
posts already translated into every supported language are omitted. Existing
translation files are skipped so manual edits are preserved. New files keep
the author, date and tags from the English source while translating its title,
description and body.

Authors use a name and an optional profile link in front matter:

```yaml
author:
  name: "William C. Canin"
  link: "https://example.com"
```

Delete an English post and all its translations with:

```sh
npm run delete:post
```

Choose a post from the menu and confirm with `s`. Enter `0` at the menu or any
other answer at the confirmation prompt to cancel without deleting files.

Edit an English post using the editor configured in `src/site-config.json`:

```sh
npm run edit:post
```

Set `news.editor` to the editor executable, for example `"/usr/bin/vim"` or
the path to a GUI editor binary. The command lists English posts, opens the
selected Markdown file, and accepts `0` to cancel.

### Translate a news post

Run the command from the project root in an interactive terminal:

```sh
npm run translate:posts
```

The command guides you through these steps:

1. **Choose the English post.** The menu lists only posts missing at least one translation. Choose a number to translate one post, the final numbered option to translate all listed posts, or `0` to cancel. If every post is translated, the command exits without showing the menus.
2. **Choose a translation CLI.** The menu offers installed versions of OpenCode, Codex, and Claude Code. Install and sign in to at least one of these tools before running the command. Each CLI handles its own authentication; this project does not call provider APIs directly or store credentials.
3. **Wait for the translations.** The selected CLI translates each missing language in turn. The command creates files under `src/content/news/<locale>/<slug>.md`. Existing translations are left untouched, so you can edit them manually. If a run stops partway through, run the command again; completed files are skipped and the remaining languages are offered again.

The translated fields are `title`, `description`, and the editorial text. The original author and profile link, date, tags, Markdown structure, links, commands, and technical names are preserved. Supported locale codes are `pt-br`, `pt-pt`, `es`, `fr`, `it`, `zh`, `ja`, `de`, `ru`, `ko`, `hi`, `ar`, `bn`, `id`, `ur`, `vi`, and `tr`.

Set the model for each CLI under `news.translate` in `src/site-config.json`. The current defaults are:

- OpenCode (`news.translate.opencode.MODEL`): `opencode/deepseek-v4.1-flash-free`
- Codex (`news.translate.codex.MODEL`): `gpt-6-luna`
- Claude Code (`news.translate.claude-code.MODEL`): `haiku`

OpenCode model IDs use the `provider/model` format. DeepSeek V4.1 Flash Free is
listed as free by OpenCode Console; its availability depends on signing in to
OpenCode and on the model remaining available there. The configured model must
be available to the account signed in to the selected CLI. Install and
authenticate the CLI using its own instructions before choosing it in the menu.

Post URLs use the same locale codes as the site, for example
`/news/first-post/`, `/news/pt-br/first-post/` and `/news/pt-pt/first-post/`.

The build removes generated version snapshots before and after the Astro build.
Do not edit generated version directories as if they were the current source.

The build also creates `dist/sitemap.xml` from Astro's sitemap index. Submit
`https://argvus.github.io/sitemap.xml` to Google Search Console; the index points
to the generated sitemap files, such as `sitemap-0.xml`.

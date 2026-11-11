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
other 17 locales. Existing translation files are skipped so manual edits are
preserved. New files keep the author, date and tags from the English source
while translating its title, description and body.

Choose the translation provider in `src/site-config.json` under
`posts.translate.mode` (`ollama`, `openai`, `gemini` or `claude-code`). Ollama,
OpenAI and Gemini use a `BASE_URL` and `MODEL` there; API keys stay out of the
JSON and are read from the environment using the variable for the selected
provider:

```sh
# Ollama local
export POSTS_TRANSLATE_OLLAMA_API_KEY="ollama"

# OpenAI
export POSTS_TRANSLATE_OPENAI_API_KEY="sua-chave"

# Gemini
export POSTS_TRANSLATE_GEMINI_API_KEY="sua-chave"

npm run translate:posts
```

For Ollama on Linux, install and start the server, then download the model set
in `posts.translate.ollama.MODEL`:

```sh
curl -fsSL https://ollama.com/install.sh | sh
ollama serve # in another terminal, if Ollama is not already running
ollama pull qwen3:8b
```

Ollama ignores the placeholder API key. Its default configuration uses
`http://localhost:11434/v1` and `qwen3:8b`; OpenAI defaults to
`https://api.openai.com/v1`. Gemini uses Google's OpenAI-compatible endpoint
and defaults to `gemini-3.6-flash`, currently listed with free API usage in the
[Gemini pricing page](https://ai.google.dev/gemini-api/docs/pricing). Free-tier
quotas and model access depend on the Google AI Studio project/account; confirm
the model is available in your [AI Studio](https://aistudio.google.com/) before
translating. Google says free-tier content may be used to improve its products,
so avoid sending private or sensitive drafts through this tier. For Claude
Code, install and authenticate the CLI;
the translator calls it in non-interactive mode and does not require an
Anthropic API key in this project:

```sh
npm install -g @anthropic-ai/claude-code
claude # sign in once, then select "claude-code" in site-config.json
```

The `claude-code.MODEL` setting is optional; an empty value uses the CLI's
configured default model. If Claude Code is missing or not authenticated, the
command prints setup guidance. API providers also report missing URLs, models
or keys before making requests.

Post URLs use the same locale codes as the site, for example
`/news/first-post/`, `/news/pt-br/first-post/` and `/news/pt-pt/first-post/`.

The build removes generated version snapshots before and after the Astro build.
Do not edit generated version directories as if they were the current source.

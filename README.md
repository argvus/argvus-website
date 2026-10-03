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

The build removes generated version snapshots before and after the Astro build.
Do not edit generated version directories as if they were the current source.

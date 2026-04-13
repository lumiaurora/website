# Lumi Aurora Portfolio Template

A polished GitHub Pages portfolio template with:

- editable JSON content files
- generated static HTML
- GitHub Actions CI
- CodeQL and Dependabot setup
- contribution and security docs
- issue and pull request templates

The live site for this repository is [lumiaurora.github.io/website](https://lumiaurora.github.io/website/).

## Use this template

This repository is intended to work as a GitHub template.

1. Click **Use this template** on GitHub.
2. Create your new repository.
3. Edit the files in `content/`.
4. Run `npm install`.
5. Run `npm run build`.
6. Commit and publish to GitHub Pages.

## Quick start

```bash
git clone https://github.com/lumiaurora/website.git
cd website
npm install
npm run build
npm run check
```

For a quick local preview:

```bash
npm run dev
```

Then open `http://localhost:4173`.

## Edit your content

Most custom text lives in:

- `content/site.json`
- `content/providers.json`
- `content/interests.json`

The final `index.html` is generated from those files plus `src/template.html`.

## Project structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── content/
├── scripts/
├── src/
├── index.html
├── script.js
└── styles.css
```

## Commands

- `npm run build`
  Regenerate `index.html` from the content files and template.
- `npm run check`
  Run content validation, rebuild checks, linting, and formatting checks.
- `npm run dev`
  Start a simple local static server.
- `npm run format`
  Format the repository files with Prettier.

## GitHub features included

- CI workflow for validation and linting
- CodeQL workflow for JavaScript analysis
- Dependabot for npm and GitHub Actions updates
- issue forms and a pull request template
- `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `CODEOWNERS`

## Deployment

This repository is set up to publish through GitHub Pages from the repository root on `main`.

If you customize the repository name, update:

- the GitHub Pages setting
- the repository homepage URL
- any references in your README

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

This repository uses the [MIT License](./LICENSE), so it is easy to fork, adapt, and reuse.

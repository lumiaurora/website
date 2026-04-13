# Content Files

This template keeps the editable portfolio content in JSON so you can swap out text without touching the HTML structure.

## Files

- `site.json`
  Main page content such as the hero section, about copy, focus section, contact details, and footer text.
- `providers.json`
  The provider-experience quote and the list of provider badges.
- `interests.json`
  Interest cards and the topic/tag cloud.

## Workflow

1. Edit the JSON files in this folder.
2. Run `npm run build`.
3. Run `npm run check` before opening a pull request.

`index.html` is generated from these files and `src/template.html`, so direct edits to `index.html` will be overwritten the next time the build runs.

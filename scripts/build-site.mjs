import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const scriptPath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptPath), "..");
const templatePath = path.join(rootDir, "src", "template.html");
const outputPath = path.join(rootDir, "index.html");

const contentFiles = {
  site: path.join(rootDir, "content", "site.json"),
  providers: path.join(rootDir, "content", "providers.json"),
  interests: path.join(rootDir, "content", "interests.json"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array.`);
  }

  value.forEach((entry, index) => {
    assertNonEmptyString(entry, `${label}[${index}]`);
  });

  return value;
}

function assertLinkArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array.`);
  }

  value.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`${label}[${index}] must be an object.`);
    }

    assertNonEmptyString(entry.label, `${label}[${index}].label`);
    assertNonEmptyString(entry.href, `${label}[${index}].href`);
  });

  return value;
}

function assertActionArray(value, label) {
  const actions = assertLinkArray(value, label);
  const variants = new Set(["primary", "secondary"]);

  actions.forEach((action, index) => {
    if (!variants.has(action.variant)) {
      throw new Error(
        `${label}[${index}].variant must be one of: ${Array.from(variants).join(", ")}.`,
      );
    }
  });

  return actions;
}

function assertCardArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array.`);
  }

  value.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`${label}[${index}] must be an object.`);
    }

    assertNonEmptyString(entry.title, `${label}[${index}].title`);
    assertNonEmptyString(entry.body, `${label}[${index}].body`);
  });

  return value;
}

async function readJson(filePath) {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents);
}

function validateSiteData(site, providers, interests) {
  if (!site || typeof site !== "object") {
    throw new Error("content/site.json must contain an object.");
  }

  if (!providers || typeof providers !== "object") {
    throw new Error("content/providers.json must contain an object.");
  }

  if (!interests || typeof interests !== "object") {
    throw new Error("content/interests.json must contain an object.");
  }

  assertNonEmptyString(site.meta?.title, "site.meta.title");
  assertNonEmptyString(site.meta?.description, "site.meta.description");
  assertNonEmptyString(site.brand?.name, "site.brand.name");
  assertNonEmptyString(site.brand?.alias, "site.brand.alias");
  assertNonEmptyString(site.brand?.avatar?.src, "site.brand.avatar.src");
  assertNonEmptyString(site.brand?.avatar?.alt, "site.brand.avatar.alt");
  assertLinkArray(site.brand?.navigation, "site.brand.navigation");

  assertNonEmptyString(site.hero?.eyebrow, "site.hero.eyebrow");
  assertNonEmptyString(site.hero?.lede, "site.hero.lede");
  assertActionArray(site.hero?.actions, "site.hero.actions");
  assertStringArray(site.hero?.highlights, "site.hero.highlights");

  assertNonEmptyString(site.profileCard?.label, "site.profileCard.label");
  assertNonEmptyString(site.profileCard?.title, "site.profileCard.title");
  assertStringArray(site.profileCard?.items, "site.profileCard.items");

  assertNonEmptyString(site.about?.label, "site.about.label");
  assertNonEmptyString(site.about?.title, "site.about.title");
  assertNonEmptyString(site.about?.body, "site.about.body");

  assertNonEmptyString(site.focus?.label, "site.focus.label");
  assertNonEmptyString(site.focus?.title, "site.focus.title");
  assertNonEmptyString(site.focus?.body, "site.focus.body");

  assertNonEmptyString(site.checklist?.label, "site.checklist.label");
  assertStringArray(site.checklist?.items, "site.checklist.items");

  assertNonEmptyString(site.contact?.label, "site.contact.label");
  assertNonEmptyString(site.contact?.title, "site.contact.title");
  assertNonEmptyString(site.contact?.body, "site.contact.body");
  assertActionArray(site.contact?.actions, "site.contact.actions");

  assertNonEmptyString(site.footer?.text, "site.footer.text");

  assertNonEmptyString(providers.label, "providers.label");
  assertNonEmptyString(providers.quote, "providers.quote");
  assertStringArray(providers.providers, "providers.providers");

  assertNonEmptyString(interests.label, "interests.label");
  assertNonEmptyString(interests.title, "interests.title");
  assertCardArray(interests.cards, "interests.cards");
  assertStringArray(interests.topics, "interests.topics");
}

export async function loadSiteData() {
  const [site, providers, interests] = await Promise.all([
    readJson(contentFiles.site),
    readJson(contentFiles.providers),
    readJson(contentFiles.interests),
  ]);

  validateSiteData(site, providers, interests);

  return { site, providers, interests };
}

function renderLinks(links) {
  return links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`,
    )
    .join("\n          ");
}

function renderActions(actions) {
  return actions
    .map(
      (action) =>
        `<a class="button button-${escapeHtml(action.variant)}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`,
    )
    .join("\n            ");
}

function renderTagList(items) {
  return items
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("\n            ");
}

function renderListItems(items) {
  return items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n              ");
}

function renderInterestCards(cards) {
  return cards
    .map((card) =>
      `
          <article class="interest-card">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
          </article>`.trim(),
    )
    .join("\n          ");
}

export async function renderSiteHtml() {
  const { site, providers, interests } = await loadSiteData();
  const template = await readFile(templatePath, "utf8");

  const tokens = {
    META_TITLE: escapeHtml(site.meta.title),
    META_DESCRIPTION: escapeHtml(site.meta.description),
    BRAND_NAME: escapeHtml(site.brand.name),
    BRAND_ALIAS: escapeHtml(site.brand.alias),
    NAV_LINKS: renderLinks(site.brand.navigation),
    HERO_EYEBROW: escapeHtml(site.hero.eyebrow),
    HERO_LEDE: escapeHtml(site.hero.lede),
    HERO_ACTIONS: renderActions(site.hero.actions),
    HERO_HIGHLIGHTS: renderTagList(site.hero.highlights),
    PROFILE_IMAGE_SRC: escapeHtml(site.brand.avatar.src),
    PROFILE_IMAGE_ALT: escapeHtml(site.brand.avatar.alt),
    PROFILE_LABEL: escapeHtml(site.profileCard.label),
    PROFILE_TITLE: escapeHtml(site.profileCard.title),
    PROFILE_ITEMS: renderListItems(site.profileCard.items),
    ABOUT_LABEL: escapeHtml(site.about.label),
    ABOUT_TITLE: escapeHtml(site.about.title),
    ABOUT_BODY: escapeHtml(site.about.body),
    PROVIDERS_LABEL: escapeHtml(providers.label),
    PROVIDERS_QUOTE: escapeHtml(providers.quote),
    PROVIDER_TAGS: renderTagList(providers.providers),
    INTERESTS_LABEL: escapeHtml(interests.label),
    INTERESTS_TITLE: escapeHtml(interests.title),
    INTEREST_CARDS: renderInterestCards(interests.cards),
    INTEREST_TOPICS: renderTagList(interests.topics),
    FOCUS_LABEL: escapeHtml(site.focus.label),
    FOCUS_TITLE: escapeHtml(site.focus.title),
    FOCUS_BODY: escapeHtml(site.focus.body),
    CHECKLIST_LABEL: escapeHtml(site.checklist.label),
    CHECKLIST_ITEMS: renderListItems(site.checklist.items),
    CONTACT_LABEL: escapeHtml(site.contact.label),
    CONTACT_TITLE: escapeHtml(site.contact.title),
    CONTACT_BODY: escapeHtml(site.contact.body),
    CONTACT_ACTIONS: renderActions(site.contact.actions),
    FOOTER_TEXT: escapeHtml(site.footer.text),
  };

  const output = Object.entries(tokens).reduce(
    (html, [token, value]) => html.replaceAll(`{{${token}}}`, value),
    template,
  );

  const unresolvedTokens = output.match(/{{[A-Z0-9_]+}}/g);
  if (unresolvedTokens) {
    throw new Error(
      `Unresolved template tokens: ${unresolvedTokens.join(", ")}`,
    );
  }

  return prettier.format(output, { parser: "html" });
}

export async function buildSite() {
  const html = await renderSiteHtml();
  await writeFile(outputPath, html, "utf8");
  return html;
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(scriptPath);

if (isDirectRun) {
  await buildSite();
  console.log("Built index.html from content and template files.");
}

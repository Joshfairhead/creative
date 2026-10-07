# Build Spec — Rust static site generator

Status: **draft, awaiting confirmation**. No code until this spec is confirmed.
Inputs: [`information-architecture.md`](information-architecture.md) and [`content-inventory.md`](content-inventory.md).

## 1. Goals and non-goals

**Goals**
- A from-scratch static site generator, written in Rust and living in this repo. It builds the whole tree (root + 3 triads + 12 categories + instances) as one site from one content pool.
- Content is **typed and validated**: bad content fails the build with a clear error and never ships broken pages.
- The structure mirrors the current static-site layout loosely (Markdown + TOML front matter, a content folder per node, co-located images), so content moves with minimal rewriting.
- Pages are fully usable without JavaScript. JS only enhances filtering, sorting and lightboxes.

**Non-goals (v1)**
- Visual design (a separate pass; v1 ships a clean, neutral theme).
- CMS or editing UI, comments, search, RSS.
- Image resizing pipelines: images are copied as-is. Thumbnails can come later.

## 2. Stack

| Concern | Choice | Why |
|---|---|---|
| Language | Rust stable, pinned via `rust-toolchain.toml` | Your requirement |
| Markdown | `pulldown-cmark` (footnotes, tables, smart punctuation, heading anchors) | Matches current Markdown features |
| Front matter + data | `serde` + `toml`, with `deny_unknown_fields` on every struct | The current `+++` TOML front matter carries over; typos fail the build |
| Templates | `askama` | Templates are checked at compile time: a missing field or typo is a compile error, not a broken page |
| Code highlighting | `syntect`, emitting CSS classes | 9 pages contain code blocks |
| CLI | `clap`: `build`, `serve`, `check`, `new` | |
| Dev server | `axum` + `notify` (rebuild on change, live reload) | |
| Errors | `thiserror` / `miette` (file + line in messages) | Readable failures |
| Styles / JS | Plain CSS with custom properties; one small vanilla JS module; no bundler, no Sass | Fewer moving parts |

## 3. Repository layout

```
Cargo.toml / rust-toolchain.toml
src/            main.rs · config.rs · content/ (load, schema, validate) · render/ · shortcodes.rs · links.rs · serve.rs
templates/      askama templates (base, card, recipient, listing, entry, gallery, music)
static/         css/ · js/ · fonts/ · favicon
site.toml       the tree: triads, categories, instances, hosts, facets (single source of truth)
content/
  root/         _index.md (business card) · for/<org>.md
  curations/sights/art/          items.toml + images/
  curations/sounds/music/        artists/<slug>/index.md · albums.toml · tracks.toml · drafts/
  curations/tastes/tea/          <slug>/index.md
  curations/thoughts/books/      …
  curations/experiences/travel/  … · drafts/
  considerations/{expositions,retrospectives,practices}/
  creations/{software,recordings,media,ventures}/
  drafts/       site-level drafts (e.g. former timeline/)
tests/          fixtures + snapshot tests
.github/workflows/ci.yml
```

A content folder's path *is* its node. An entry outside a node declared in `site.toml` is a build error.

## 4. Content model

**`site.toml`** declares each node's id, label, parent, host (for triads and categories), path (for instances), and allowed facets. Menus, breadcrumbs, host routing and listings all derive from it.

**Entry front matter** (common to all entries):
- Required: `title`, `date`, `description`.
- Optional: `tags`, `card`, `hero`, `banner`, `weight`, `toc`, `featured`.

`authors` is dropped, since the site has a single author. Per-page `styles`/`scripts` are dropped: components come from the entry's node. Fields specific to a node type (e.g. tea) are declared on that type and validated the same way.

**Data collections** (records, not pages):
- `art/items.toml`: `id, group, artist, title, source, width, height, file`.
- `music/albums.toml` / `tracks.toml`: `title, artist, link, cover?, artist_page?`. Here `artist_page` must resolve to an artist entry.

**Recipient cards** (`root/for/<org>.md`): `title`, `tagline`, `links[] {label, url}`, the same shape as in the hub.

**Shortcodes**: `image(...)`, `youtube(...)` and `vimeo(...)` keep their current names and arguments. An unknown shortcode is a build error. Inline HTML in Markdown passes through.

## 5. Validation: the build fails on

1. TOML/Markdown parse errors, unknown or missing fields, invalid dates.
2. Any referenced local file that does not exist: card, hero, banner, shortcode image, data-record file.
3. Duplicate slugs within a node, or an entry outside a declared node.
4. Broken internal links or anchors in the rendered output. Every `href`/`src` is checked after rendering.
5. Malformed external URLs (syntax only, no network), e.g. the existing `https:/https://…`.
6. Unresolved references (`artist_page`, facet values not declared in `site.toml`).
7. Anything under `drafts/` linked from published content.

Empty nodes produce a warning, not an error, and are hidden from menus.

## 6. Pages rendered

| Page | Content |
|---|---|
| Root | Business card: name, contact email, three triad links |
| `/for/<org>` | Recipient card (tagline + links) |
| Triad / category / instance | Breadcrumb, level menu (children of the current node), and a card grid of all published descendants |
| Entry | Hero, title, date, reading time, optional ToC, body, breadcrumb back up |
| Art | Masonry gallery with lightbox; facets: group, artist |
| Music | Facet switch Artists / Albums / Tracks; artist cards link to artist pages; album and track records link out |
| 404 | Per site, with a link to root |

Listings sort by date, newest first, by default. Client-side sort (date / title) and tag or facet filtering are progressive enhancements over a server-rendered list.

## 7. URLs and hosting

- One output tree, `dist/`, laid out by path: `/curations/sights/art/...`.
- **Two URL modes:**
  - `--mode prod` emits host URLs (`https://sights.joshafairhead.com/art/…`);
  - `--mode local` emits path URLs, so the whole site works on `localhost` with no host setup.
- The build generates the host routing rules (e.g. `sights.joshafairhead.com/*` → `/curations/sights/:splat`) from `site.toml`, plus canonical links per page.
- **Hosting:** keep Netlify, as one site with all 16 domains attached. GitHub Actions runs the build and checks; only a green `main` deploys the prebuilt `dist/` via the Netlify CLI. Netlify itself never compiles anything.

## 8. Quality gates (CI on every push / PR)

1. `cargo fmt --check`
2. `cargo clippy --all-targets -- -D warnings`
3. `cargo test`: unit tests for the parsers and validators, plus snapshot tests (`insta`) of rendered fixture pages.
4. `cargo run -- build --mode prod --strict`: the full validation in §5 over the real content.
5. The built-in link check over `dist/`.

A red CI blocks merge and deploy. Locally, `cargo run -- check` runs 3–5.

## 9. Migration (one-off)

A `tools/migrate` script (run once, then deleted) moves content from the Zola layout into the new tree, following `content-inventory.md` §6:
- Moves folders, and sets drafts by location instead of flags.
- Converts the album-gallery HTML and "Special Mentions" into `albums.toml` / `tracks.toml`.
- Imports `items.json` and its images from the Aesthetics Board.
- Imports the business card and `/for/` pages from `Joshfairhead/hub`.

The migrated content must pass §5 before Zola files are removed.

## 10. Phases and acceptance

| Phase | Delivers | Done when |
|---|---|---|
| P0 Scaffold | Cargo project, CLI skeleton, CI pipeline | CI green on an empty site |
| P1 Model | `site.toml`, schemas, loader, validation, migration | All 111 pages + records load; validation passes; deliberate bad fixtures fail with clear errors |
| P2 Render | Templates, menus, breadcrumbs, listings, entry pages, shortcodes | Every node and entry renders; link check passes; snapshots reviewed |
| P3 Collections | Art gallery, music facets, recipient cards | 130 images, 64 albums and 14 tracks render with filters; works without JS |
| P4 Deploy | Host routing, Netlify via Actions, DNS for 16 hosts | Each host serves its node; old hosts retired |
| P5 Cleanup | Remove Zola config, theme, scripts; archive `hub` | Repo contains only the new build |

## 11. Open questions

1. **`cv.` and `facilitation.`**: the hub's recipient cards link to these hosts. Bring them into this site (where in the tree?), or leave them as external links?
2. **Netlify via GitHub Actions** (§7): OK? It needs a `NETLIFY_AUTH_TOKEN` repository secret.
3. **Repo**: build here in `creative` (and maybe rename it later), or start a new repo?

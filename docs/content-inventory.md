# Content Inventory — current estate → new schema

Companion to [`information-architecture.md`](information-architecture.md). This lists everything that exists today and where each piece lands under the triad → category → instance schema. Snapshot taken at commit `c3541f8`.

## 1. Current estate

| # | Property | Where it lives | What it shows | How it's built / served |
|---|---|---|---|---|
| 1 | **creative.joshafairhead.com** | this repo, `config.toml` | All 10 sections, as one flat card grid with tag filter and sort | `zola build` (the only build in `netlify.toml`) |
| 2 | **blog.joshafairhead.com** | this repo, `config.blog.toml` | books, music, study, travel | `build-views.sh` / `build.sh` copy a section subset |
| 3 | **portfolio.joshafairhead.com** | this repo, `config.portfolio.toml` | multimedia, recordings, software, tech-management, timeline | same |
| 4 | **tea.joshafairhead.com** | this repo, `config.tea.toml` | tea | `build-views.sh` only (`build.sh` has no tea view) |
| 5 | **Aesthetics Board** | Claude artifact (private, unpublished): https://claude.ai/artifact/U2uwxKnSU2PrevNQqKd8mK | 130 images of visual art with Collection/Screening views | Static `items.json` and 130 image files in the artifact, plus a `db` for removals and screening (currently empty) |
| 6 | **joshafairhead.com** (business card) | **not in this repo**: location to confirm | Business card | Unknown |

## 2. Infrastructure to reconfigure

| Item | Today | Fate under new schema |
|---|---|---|
| `config.toml` | creative hub; nav links to Blog and Portfolio | Replaced by per-node config (root, 3 triads, 12 categories) or a single config if the tool allows it |
| `config.blog.toml`, `config.portfolio.toml`, `config.tea.toml` | 3 subset views | Retire |
| `build-views.sh`, `build.sh`, `serve-view.sh` | Two overlapping build scripts (`build.sh` is missing tea and writes to different output dirs) plus a local serve script | Retire. Replace with one tree-driven build |
| `netlify.toml` | Builds the creative view only | Blog, portfolio and tea deploy via settings outside the repo (to confirm in Netlify). Redo for 16 hosts |
| `templates/index.html` + `partials/card_grid.html` | Flat grid; skips `extra.hide_from_home` | Becomes the node grid (triad, category or instance listing) |
| `templates/partials/nav.html` + `static/tag-filter.js` | Tag filter (only "Tea" shown by default) and sort menu | Becomes the level menu (next-level choices) plus breadcrumb. Tag filter optional within a node |
| Section `_index.md` titles | "Technical" (software), "Writing" (study), "Career" (timeline), "Tea Journal" | Retitled to node names |
| Tags | Section-mirroring tags (Music, Travel, Tea, Recordings, Study, Software, Multimedia, CV…) plus fine tags (tea grades, Artist, Live, Studio, Venues, Events) | Section-mirroring tags become redundant (the node replaces them). Keep the fine tags as facets |

## 3. Totals by new node

| New node | Source | Entries | Not publicly listed |
|---|---|---|---|
| Curations › Sights › Art | Aesthetics Board | 130 images (6 groups) | — |
| Curations › Sounds › Music | `music/` | 23 | 1 draft |
| Curations › Tastes › Tea | `tea/` | 18 | — |
| Curations › Ideas › Books | `books/` | 8 | — |
| Curations › Experiences › Travel | `travel/` | 19 | 2 `hide_from_home` |
| Considerations › Expositions | `study/` (part) | 6 | 2 draft |
| Considerations › Retrospectives | `study/` (part) | 5 | — |
| Considerations › Practices | `study/` (part) | 2 | — |
| Creations › Software | `software/` | 9 | 1 draft |
| Creations › Recordings | `recordings/` | 15 | 1 draft |
| Creations › Media | `multimedia/` | 6 | — |
| Creations › Ventures | `tech-management/` | 8 | — |
| About (CV) | `timeline/` | 5 | 5 draft |
| **Total** | | **124 pages + 130 images** | |

Every current entry maps to exactly one node, with no orphans. The only section that splits is `study/`; all others move whole.

## 4. Aesthetics Board → Curations › Sights › Art

The board's 130 images are all live: the board's `removed` and `screening` collections are empty. Each image record has the fields `id, section, artist, title, source, w, h, file`.

| Board group | Images | Artists |
|---|---|---|
| Neo-Tantric | 53 | Mahirwan Mamtani (30), G.R. Santosh (14), Biren De (9) |
| Japanese | 23 | Kawase Hasui (18), Hiroshi Yoshida (3), Hiroo Isono (1), unidentified shin-hanga (1) |
| Nat Girsberger | 17 | Nat Girsberger |
| All India Radio | 16 | All India Radio |
| Leo Kenney | 13 | Leo Kenney |
| Generative | 8 | Hamonshū (@MoriYuzan) |

What migration needs:
- **A different content shape.** Board items are images with captions and source links, not article pages. Art needs a gallery entry type (one record per image) rather than `index.md` pages.
- **Asset export.** The image files live in the artifact's file store and must be copied into the repo or a media host.
- **Groups and artists are facets, not navigation.** The schema has three levels and Art is already an instance, so they work as filters *within* Art, the way the board's chips do today.
- **The screening workflow** (Keep/Pass on candidates) is curation tooling. Whether it survives on the public site or stays a private artifact is for the build spec to decide.

## 5. Per-entry mapping

Flags: `draft` means not built. `hide_from_home` means built and reachable by URL but left out of grids.

### `music/` — "Music" · 23 entries · today on: creative, blog

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `all` | Special Mentions |  | Curations › Sounds › Music |
| `avishicohen` | Avishi Cohen |  | Curations › Sounds › Music |
| `brianwilson` | Brian Wilson |  | Curations › Sounds › Music |
| `catstevens` | Cat Stevens |  | Curations › Sounds › Music |
| `fatfreddiesdrop` | Fat Freddies Drop |  | Curations › Sounds › Music |
| `floatingpoint` | Floating Points |  | Curations › Sounds › Music |
| `ghost` | Ghost |  | Curations › Sounds › Music |
| `gogopenguin` | GoGo Penguin |  | Curations › Sounds › Music |
| `hilltophoods` | Hilltop Hoods |  | Curations › Sounds › Music |
| `ironbutterfly` | Iron Butterfly | draft | Curations › Sounds › Music |
| `justice` | Justice |  | Curations › Sounds › Music |
| `killitkid` | Kill it Kid |  | Curations › Sounds › Music |
| `maynardjameskenan` | Maynard James Keenan |  | Curations › Sounds › Music |
| `nilerodgers` | Nile Rodgers |  | Curations › Sounds › Music |
| `robertfripp` | Robert Fripp |  | Curations › Sounds › Music |
| `robertplant` | Robert Plant |  | Curations › Sounds › Music |
| `snarkypuppy` | Snarky Puppy |  | Curations › Sounds › Music |
| `steelydan` | Steely Dan |  | Curations › Sounds › Music |
| `stevewilson` | Steve Wilson |  | Curations › Sounds › Music |
| `sturgilsimpson` | Sturgill Simpson |  | Curations › Sounds › Music |
| `sylvainrichards20syl` | Sylvain Richards (20SYL) |  | Curations › Sounds › Music |
| `theband` | The Band |  | Curations › Sounds › Music |
| `wolfmother` | Wolfmother |  | Curations › Sounds › Music |

### `tea/` — "Tea Journal" · 18 entries · today on: creative, tea

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `2009-12-05-assam-tgfop` | Assam T.G.F.O.P. |  | Curations › Tastes › Tea |
| `2009-12-05-ceylon-op` | Ceylon O.P. |  | Curations › Tastes › Tea |
| `2009-12-05-ceylon-silver-tips` | Ceylon Silver Tips |  | Curations › Tastes › Tea |
| `2009-12-05-english-breakfast-blend` | English Breakfast Blend |  | Curations › Tastes › Tea |
| `2010-02-20-arabian-tea` | Arabian Tea |  | Curations › Tastes › Tea |
| `2010-02-25-china-black-tea` | China Black Tea |  | Curations › Tastes › Tea |
| `2010-03-15-pettiagalla-op-ceylon` | Pettiagalla O.P. Ceylon |  | Curations › Tastes › Tea |
| `2010-06-06-blue-lady` | Blue Lady |  | Curations › Tastes › Tea |
| `2010-06-06-harmutty-tippy-golden-assam` | Harmutty Tippy Golden Assam |  | Curations › Tastes › Tea |
| `2010-06-06-passion-fruit-tea` | Passion Fruit Tea |  | Curations › Tastes › Tea |
| `2010-08-12-lingia-ftgfop1` | Lingia FTGFOP1 |  | Curations › Tastes › Tea |
| `2010-08-22-margrets-hope-ftgfop` | Margrets Hope FTGFOP |  | Curations › Tastes › Tea |
| `2010-09-14-whittards-125th-anniversary-blend` | Whittards 125th Anniversary Blend |  | Curations › Tastes › Tea |
| `2010-11-24-bannockburn-ftgfop1-darjeeling` | Bannockburn FTGFOP1 Darjeeling |  | Curations › Tastes › Tea |
| `2010-11-29-fortnum-mason-royal-blend` | Fortnum & Mason Royal Blend |  | Curations › Tastes › Tea |
| `2010-11-29-mohokutie-second-flush-assam` | Mohokutie Second Flush Assam |  | Curations › Tastes › Tea |
| `2010-11-29-whittards-darjeeling` | Whittard's Darjeeling |  | Curations › Tastes › Tea |
| `2010-11-29-whittards-mango-tea` | Whittard's Mango Tea |  | Curations › Tastes › Tea |

### `books/` — "Books" · 8 entries · today on: creative, blog

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `caravanofdreams` | Caravan of Dreams |  | Curations › Ideas › Books |
| `dramaticuniversevol3` | The Dramatic Universe Vol. 3: Man and His Nature |  | Curations › Ideas › Books |
| `dramaticuniversevol4` | The Dramatic Universe Vol. 4: History |  | Curations › Ideas › Books |
| `dramaticuniversevolume1` | The Dramatic Universe Vol. 1: The Foundations of Natural Philosophy |  | Curations › Ideas › Books |
| `dramaticuniversevolume2` | The Dramatic Universe Vol. 2: The Foundations of Moral Philosophy |  | Curations › Ideas › Books |
| `energiesmaterialvitalcosmic` | Energies; material, vital, cosmic |  | Curations › Ideas › Books |
| `musicthebrainandecstacy` | Music The Brain and Ecstacy |  | Curations › Ideas › Books |
| `trueperception` | True Perception |  | Curations › Ideas › Books |

### `travel/` — "Travel" · 19 entries · today on: creative, blog

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `Indiapt1` | India 1: Gorkana |  | Curations › Experiences › Travel |
| `austria` | Austria: Crypto Commons Gathering |  | Curations › Experiences › Travel |
| `cornwall-reflections` | Cornwall Reflections | hide_from_home | Curations › Experiences › Travel |
| `croatia` | Croatia: Metafest |  | Curations › Experiences › Travel |
| `eden-project` | The Eden Project |  | Curations › Experiences › Travel |
| `heligan-gardens` | Heligan Gardens |  | Curations › Experiences › Travel |
| `indiapt2` | India 2: Bangalore |  | Curations › Experiences › Travel |
| `indiapt3` | India 3: Auroville Involoution |  | Curations › Experiences › Travel |
| `indiapt4` | India 4: Auroville Evolution |  | Curations › Experiences › Travel |
| `japan1` | Japan 1: Tokyo Energy |  | Curations › Experiences › Travel |
| `japan2` | Japan 2: Kyoto Tranquility |  | Curations › Experiences › Travel |
| `japan3` | Japan 3: Tokyo Return |  | Curations › Experiences › Travel |
| `kew-gardens` | Kew Gardens |  | Curations › Experiences › Travel |
| `metaphorum` | UK: Metaphorum Manchester |  | Curations › Experiences › Travel |
| `newquay-par` | Newquay Participatory Action Research | hide_from_home | Curations › Experiences › Travel |
| `olbia` | Olbia: Metalinguistics |  | Curations › Experiences › Travel |
| `poland` | Poland: Chinwags Poznan |  | Curations › Experiences › Travel |
| `portugal` | Portugal: Boom Festival |  | Curations › Experiences › Travel |
| `switzerland` | Switzerland: Solstice Festival Geneva |  | Curations › Experiences › Travel |

### `study/` — "Writing" · 13 entries · today on: creative, blog

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `cats_theory_1` | Cats Theory Primer: Ground Zero |  | Considerations › Expositions |
| `cats_theory_2` | Cats Theory Primer: Reasoning and Revisions |  | Considerations › Expositions |
| `emergentcyclicaltheory` | Emergent Cyclical Theory |  | Considerations › Expositions |
| `explorations_in_cosmic_ecology` | Explorations in Cosmic Ecology | draft | Considerations › Expositions |
| `interactive_vsm` | Methodology Development: Interactive VSM |  | Considerations › Practices |
| `monastic_design` | Methodology Development: Monastic Design |  | Considerations › Practices |
| `process_philosophy_1` | Process Thought and Science 2025 (Session 1) |  | Considerations › Retrospectives |
| `process_philosophy_2` | Process Thought and Science 2025 (Session 2) |  | Considerations › Retrospectives |
| `process_philosophy_3` | Process Thought and Science 2025 (Session 3) |  | Considerations › Retrospectives |
| `process_philosophy_4` | Process Thought and Science 2025 (Session 4) |  | Considerations › Retrospectives |
| `process_philosophy_5` | Process Thought and Science 2025 (Session 5) |  | Considerations › Retrospectives |
| `reflections_on_cosmic_ecology` | Reflections on Cosmic Ecology | draft | Considerations › Expositions |
| `semiotics` | Semiotics in Brief |  | Considerations › Expositions |

### `software/` — "Technical" · 9 entries · today on: creative, portfolio

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `adaptivecapital` | Adaptive Capital |  | Creations › Software |
| `blockchainonboarding` | Blockchain Onboarding |  | Creations › Software |
| `hackalong` | Hackalong | draft | Creations › Software |
| `hermitage` | Hermitage |  | Creations › Software |
| `holons` | Holons |  | Creations › Software |
| `interspace` | Interspace |  | Creations › Software |
| `notabot` | Not-a-Bot |  | Creations › Software |
| `saturator` | Saturator |  | Creations › Software |
| `systematics-interface` | Systematics Interface |  | Creations › Software |

### `recordings/` — "Recordings" · 15 entries · today on: creative, portfolio

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `beatbehind` | Beat Behind |  | Creations › Recordings |
| `brentwoodroyalyouthorchestra` | Brentwood Royal Youth Legion Orchestra |  | Creations › Recordings |
| `greysky` | Grey Sky |  | Creations › Recordings |
| `harmonicsplinters` | Harmonic Splinters |  | Creations › Recordings |
| `irishchamberorchestra` | Irish Chamber Orchestra |  | Creations › Recordings |
| `mountains` | Mountains |  | Creations › Recordings |
| `neonfleacircus` | Fistfull of I.O.U's |  | Creations › Recordings |
| `petemolinari` | Pete Moulinari |  | Creations › Recordings |
| `primates` | Primates |  | Creations › Recordings |
| `projectplay` | Project Play |  | Creations › Recordings |
| `robots` | Robots |  | Creations › Recordings |
| `soascubanbigbands` | SOAS Cuban Big Band |  | Creations › Recordings |
| `sonsofgingerbread` | Sons of Gingerbread |  | Creations › Recordings |
| `thamesvallyphilharmonia` | Isobella Peck Cubann II Thames Valley Philharmonic |  | Creations › Recordings |
| `urbanbigbandandgamelanorchestra` | Urban Big Band and Gamelan Orchestra Recording | draft | Creations › Recordings |

### `multimedia/` — "Multimedia" · 6 entries · today on: creative, portfolio

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `calma` | Calma Video |  | Creations › Media |
| `cursed` | Cursed Animation |  | Creations › Media |
| `elephantsdream` | Elephants Dream Animation |  | Creations › Media |
| `encaged` | Encaged |  | Creations › Media |
| `lespaul` | Les Paul |  | Creations › Media |
| `wasser` | Wasser |  | Creations › Media |

### `tech-management/` — "Tech Management" · 8 entries · today on: creative, portfolio

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `borrisbrejeca` | Boris Brejcha (lights) |  | Creations › Ventures |
| `eggldn` | Egg London - Technical Management |  | Creations › Ventures |
| `equinoxunconf` | Equinox Unconf |  | Creations › Ventures |
| `ericmorillo` | Eric Morillo (lights) |  | Creations › Ventures |
| `mber` | Mber |  | Creations › Ventures |
| `oriole` | Oriole |  | Creations › Ventures |
| `sbg` | SBG - Technical Management |  | Creations › Ventures |
| `swift` | Swift |  | Creations › Ventures |

### `timeline/` — "Career" · 5 entries · today on: creative, portfolio

| Entry | Title | Flags | → New node |
|---|---|---|---|
| `commonsstack` | Commons Stack | draft | About (CV page) |
| `giveth` | Giveth | draft | About (CV page) |
| `liminalvillage` | Liminal Village | draft | About (CV page) |
| `pillar` | Pillar Project | draft | About (CV page) |
| `regenfoundation` | Regen Foundation | draft | About (CV page) |

### Aesthetics Board — 130 images · today: private artifact only

All 130 images → Curations › Sights › Art, grouped as in §4.

## 6. Issues surfaced by the inventory

1. **Business card location.** `joshafairhead.com` isn't in this repo. Its source needs finding so it can be brought into the build, or linked from it.
2. **Deploy config for blog, portfolio and tea is outside the repo.** Check Netlify site settings before retiring those hosts.
3. **Drafts.** The whole of `timeline/` (5 entries) is draft, so the About page has no published content yet. The two cosmic-ecology pieces are also draft.
4. **`music/all` ("Special Mentions")** is a roundup page, not an artist entry. Decide whether it stays an entry under Music or becomes Music's intro text.
5. **Duplicate build scripts.** `build.sh` and `build-views.sh` overlap and disagree. Both are retired in the rebuild.

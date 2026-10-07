# Information Architecture — Curations · Considerations · Creations

Status: **ratified** (design only, build tool deliberately undecided).
Companion: [`content-inventory.md`](content-inventory.md) — what exists today and where each piece goes.

## 1. Purpose and semantics

The whole site is one content pool (a monolith) viewed through a three-level filter:
**triad → category → instance**. The triad follows a receive → reflect → make progression.

| Triad | Meaning | Placement test |
|---|---|---|
| **Curations** | the aesthetic world taken in | Did I *receive* it? |
| **Considerations** | what is thought through | Did I *think it through*? |
| **Creations** | what is made | Did I *make* it? |

Career history sits outside the triad as an **About/CV page**.

## 2. Tree

```
joshafairhead.com             business card → 3 triad links + About
├─ Curations
│   ├─ Sights       › Art          (Aesthetics Board collection)
│   ├─ Sounds       › Music
│   ├─ Tastes       › Tea
│   ├─ Thoughts     › Books
│   └─ Experiences  › Travel
├─ Considerations
│   ├─ Expositions                 (own explanatory writing and research)
│   ├─ Retrospectives              (write-ups of courses taken)
│   └─ Practices                   (methods developed)
├─ Creations
│   ├─ Software
│   ├─ Recordings
│   ├─ Media                       (scores, sound design, film, craft)
│   └─ Ventures                    (venues, events, organising)
└─ About                           (career / CV)
```

The instance level is optional per category. It is how a category grows: Sights › Art could later gain Sights › Film. Categories without instances are terminal.

## 3. Filter / navigation model

1. **Root (business card):** identity plus three triad links and an About link. No content listing.
2. **Selecting a triad** shows every entry in that triad. The menu offers that triad's categories.
3. **Selecting a category** narrows to that category's entries. The menu offers its instances, if any.
4. **Selecting an instance** narrows further. This is the terminal filter.
5. Every selection does three things together: (a) filters the content, (b) changes the address, (c) swaps the menu to the next level's options.
6. A breadcrumb (e.g. Curations › Sights › Art) shows the path, and each crumb steps back up a level.
7. There is no sideways movement between triads except back up through the breadcrumb or root.
8. Nodes with no published entries are hidden from menus.

## 4. Address map

Subdomains name the triad or category. Instances are paths under their category host.

| Level | Hosts |
|---|---|
| Root | `joshafairhead.com` |
| Triads (3) | `curations.` · `considerations.` · `creations.` |
| Categories (12) | `sights.` `sounds.` `tastes.` `thoughts.` `experiences.` · `expositions.` `retrospectives.` `practices.` · `software.` `recordings.` `media.` `ventures.` |
| Instances | `sights.…/art` · `sounds.…/music` · `tastes.…/tea` · `thoughts.…/books` · `experiences.…/travel` |
| About | `joshafairhead.com/about` |

Total: 16 hosts. Retired hosts: `creative.`, `blog.`, `portfolio.`, `tea.` are dropped with no redirects. The owner is the only user of these hosts.

## 5. Constraints handed to the build phase

- Moving between subdomains is a full page load. The "filtering one monolith" feel (shared shell, consistent menu, fast transition) is a requirement on whichever tool is chosen.
- Entries keep a single home node. Tags may remain as a secondary facet inside a node, but tags never define navigation.
- Hidden-from-grid and draft states must survive migration (see inventory §5).

## 6. Deliberately open

- The About page's form and content.
- Visual design.
- The build tool: extend Zola or rebuild. This gets its own spec, which takes `content-inventory.md` as input.

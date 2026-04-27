# Believe Academy — Design System

> **"Creemos en lo que hacemos"** — #YoSoyBelieve
> Design system for the Believe Academy (Arequipa, Perú) student / teacher / reception / owner / finance portal.

---

## What this system is for

Believe Academy is a language school in Arequipa, Perú, founded in 2016 by **Alejandro Maestre**. Today, almost every operation runs on WhatsApp + Excel:

- **Students** WhatsApp the school every Friday with the 4 time-slots (max 1h each, Mon–Sat 8:30–18:00) they want for next week. Reception replies confirming availability. On class day, students go to reception to ask which classroom they're in — it changes each time. The teacher hands a paper sheet at the end for signatures (name / unit / lesson). Payments (varying amounts, varying dates — first-5-days or mid-month) are announced by WhatsApp with Yape/Plin/BCP details, paid, then the student sends a screenshot.
- **Teachers** run class, scribble the attendance sheet, hand it back to admin.
- **Reception** assigns classrooms on the fly, answers WhatsApp, keeps the weekly schedule in Excel.
- **Owner** (Alejandro) confirms payments by reading screenshots sent by WhatsApp.

The MVP replaces all of this with a single portal that serves 5 roles:

| Role | Primary jobs |
|---|---|
| **Estudiante** | See today's class + classroom, reserve next week's slots from available options, scan QR on arrival, view payment dates/methods, upload receipt. |
| **Profesor** | See today's agenda + student roster, mark attendance digitally (lesson + unit), see cancellations. |
| **Recepción** | Publish each week's available slots, assign classrooms, handle reservation confirmations, answer questions. |
| **Dueño** | Approve payment receipts, see revenue at a glance, see occupancy, handle exceptions. |
| **Finanzas** | Reports, reconciliation, per-student billing cycles, overdue follow-up. |

### The 8 languages taught

🇬🇧 Inglés · 🇫🇷 Francés · 🇩🇪 Alemán · 🇮🇹 Italiano · 🇧🇷 Portugués · 🇨🇳 Chino Mandarín · 🇯🇵 Japonés · 🇪🇸 Español

### Modalities

- **Programa Presencial** — on-site, max 7 students per group, personalized
- **Programa Virtual** — live online
- **Kids Virtual y Presencial** — children's tracks
- **Exámenes Internacionales** — prep for MCER / international certs

---

## Sources & references

- **Live website:** https://www.believeacademyperu.com/
- **GitHub seed repo:** `devedux/believe` (placeholder README only; no code yet)
- **User-provided:** official brand colors (`#CF2E2E`, `#0693E3`, `#025C9B`, `#FCB900`, `#020381`) and the official SVG wordmark (in `assets/logo-believe.svg`).
- **Contact:** info@believeacademyperu.com · +51 994 367 764 · Calle Los Jazmines 109 – Urb. Primavera – Yanahuara, Arequipa – Perú.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file. |
| `SKILL.md` | Agent-Skill front-matter — loadable into Claude Code / Skills. |
| `colors_and_type.css` | All design tokens (colors, type, spacing, radii, shadows, motion). |
| `assets/` | Logos, images, any static brand material. |
| `preview/` | Design-system preview cards (one concept per card). |
| `ui_kits/portal/` | The Believe Portal UI kit — base components + 5 screens (one per role). |

---

## CONTENT FUNDAMENTALS

How Believe sounds — observed directly from the website.

### Voice
- **Warm, proud, slightly declarative.** Believe talks about what it *does*, not what it sells. Copy often reads like a promise: *"Creemos en lo que hacemos"*, *"Ofrecemos una educación distinta"*, *"Disfrutamos la experiencia de aprender"*.
- **First-person plural ("nosotros")** — the school, collectively. On marketing, "we" do things *for* the student. On the portal, we switch to a friendlier *tú* when addressing the logged-in user ("Hola, Sebastián", "Tus clases de esta semana").
- **Spanish-first**, Perú variant. Informal *tú*, never *usted* — Believe is young-adult friendly.

### Casing
- **UPPERCASE for section eyebrows & calls to action**: `CALIDAD PARA TU EDUCACIÓN`, `METODOLOGÍA`, `TRIUNFA`, `CONTÁCTANOS`. This is a strong Believe tic — preserve it.
- **Sentence case for body + in-app copy.** Don't shout inside the portal.
- **Title Case for menu items and button labels** in the portal (`Reservar clases`, `Ver horario`).

### Tone by surface
| Surface | Tone |
|---|---|
| Marketing site | Aspirational, motivational — "logra todas tus metas", "triunfa". |
| Student portal | Warm, clear, concise. Celebrates streaks / milestones gently. |
| Teacher portal | Practical, utilitarian. No emojis, no flourishes. |
| Reception / Admin | Dense, efficient, lots of tables. |
| Owner / Finance | Report-style, numerical, calm. |
| Error / empty states | Honest and actionable ("No hay clases asignadas para hoy — ¿quieres reservar?"). |

### Emoji usage
- **Flags ONLY** (🇬🇧 🇫🇷 🇩🇪 🇮🇹 🇧🇷 🇨🇳 🇯🇵 🇪🇸) as **secondary** language indicators — always paired with a text label. The website uses them this way in the enrollment form.
- **No decorative emoji** anywhere else. No 🎉, no ✨, no 🚀. Believe is not Duolingo — it's a real academy.

### Language-swap (student preference)
The portal respects the student's **studied language**: if they're learning French, they can opt in to have *parts* of the UI (greetings, navigation) swap to French as passive immersion. Defaults to Spanish. This is a Believe-specific "practice everywhere" affordance; we bake it into the design system.

### Copy examples (good vs bad)

| ✅ Believe | ❌ Not Believe |
|---|---|
| "Reserva tus 4 clases de la próxima semana" | "Book now! ⚡" |
| "Tu próxima clase: Hoy 16:00, Aula 3" | "You have a class coming up 👉" |
| "Subí el comprobante — validamos en el día" | "Upload your proof of payment ASAP!!" |
| "YO SOY BELIEVE" (eyebrow) | "#believefam" |
| "Sin clases hoy. Descansá o agendá una extra." | "Oops! No classes today 😢" |

---

## VISUAL FOUNDATIONS

### Palette philosophy
Believe's palette is **Gutenberg-block vivid** — five highly-saturated primaries against white. On the marketing site they function as accent swatches; in the portal we promote them into a proper system:

- **Cyan `#0693E3`** is the **primary** — fluency, horizon, "a world opens up." Used for primary buttons, links, active states, the main gradient.
- **Indigo `#020381`** is the **anchor** — night sky, authority. Used for headlines and inverse surfaces (dark headers, hero backgrounds).
- **Yellow `#FCB900`** is the **spark** — highlights, streak badges, kids, celebrations. Never large fills.
- **Red `#CF2E2E`** is **destructive/alert only** — never decorative.
- **Mid-blue `#025C9B`** bridges cyan→indigo in gradients.

See `colors_and_type.css` for the full 10-step scales.

### Typography
- **Manrope** as the primary face — modern geometric sans, warm, highly legible at small sizes, great for multilingual (handles accents + Mandarin/Japanese fallback gracefully).
- **Inter** as fallback for dense data views.
- **JetBrains Mono** for codes, tokens, invoice numbers.
- Tight negative tracking on display, normal on body, **wide tracking on UPPERCASE eyebrows** (very Believe).
- **Yellow underline accent** under key headlines (homage to the brand-site hover style).

> **Flagged substitution:** Believe's site uses a WordPress stock face. I substituted **Manrope** as a modern, international match. If you have a spec'd brand font (e.g. something from Yantra Diseño, who designed the site), please share and I'll swap.

### Spacing & layout
- 4px base grid. 8-point rhythm for most UI.
- Cards: 24px internal padding, 16px gap; section bands: 48–80px vertical.
- Portal uses a **sidebar-left + content + optional right rail** shell on desktop; stacks vertically on mobile.
- **Max content width 1240px** — Believe pages breathe, they don't stretch.

### Backgrounds
- **Dominant: clean white (`--bg-surface`) and very-light cool gray (`--bg-app`).** 90% of surfaces.
- **Hero / section breakers: `--grad-night`** (indigo→cyan-800 diagonal) for impact.
- **No repeating textures, no noise overlays, no hand-drawn illustrations.** Believe's visual language is photographic + typographic, not illustrative.
- **Full-bleed photography** for marketing-style heroes — always warm, in-situ, classroom/students (never stock).

### Imagery
- Warm-toned, slightly overexposed, real students. Never blue-tinted or moody.
- Photos get a **subtle indigo protection gradient** bottom-left when text overlays them (for legibility — not decoration).
- Corner radius on photos: `--radius-lg` (14px). Never square on the web; never circular unless it's an avatar.

### Borders
- 1px borders, color `--border-1` (cool gray-200). On dark surfaces: `rgba(255,255,255,0.12)`.
- No thick borders, no double borders. When a card needs emphasis, use **shadow** or **brand left-border 3px** — never both.

### Shadow & elevation
Five-level system, tinted with indigo (**not** pure black) for brand cohesion. See `--shadow-xs` → `--shadow-xl` in CSS. **Brand shadow** (`--shadow-brand`, cyan-tinted) used only on the hero CTA and focused brand elements.

### Radii
- 4px for chips/tags, 10px for inputs, 14px for cards, 20px for modals / hero surfaces, full-pill for role/status badges and primary CTAs.
- **Believe CTAs are pill-shaped** (a nod to the marketing site's buttons).

### Hover / press states
- **Hover:** +4% brightness on brand buttons (use `color-mix` or a slightly lighter shade token), `-y: 1px` subtle lift on cards, underline on text links.
- **Press:** `-y: 0`, shadow compresses one step, opacity 0.95.
- **Active nav item:** brand-colored left border (3px) + subtle cyan-50 background. No pills-around-text.
- **Disabled:** opacity 0.45, `cursor: not-allowed`, no hover.

### Focus
- Always visible. 2px `--cyan-400` outline + 2px offset, `--radius-sm` matches the element's radius. **Never remove focus rings.**

### Motion
- **Fast and springy for interactions** (`--dur-fast` / `--ease-out`), **slow and calm for page transitions** (`--dur-slow` / `--ease-in-out`).
- **No bounce, no wobble**, except a subtle spring on "booking confirmed" and "payment approved" (`--ease-spring`).
- Default fades: 160ms opacity, no slide. Believe feels *calm and confident*, not twitchy.

### Transparency & blur
- Reserved for **sticky top bar** (90% white + 10px backdrop-blur) and modal scrims (indigo-900 @ 60%).
- **No frosted-glass cards**, no "liquid" surfaces, no gradients inside cards.

### Layout rules / fixed elements
- Sidebar fixed on desktop, off-canvas drawer on mobile.
- Bottom app-bar on mobile for the 4 main destinations (Home / Clases / Pagos / Perfil).
- **Sticky "today's class" ribbon** at the very top when a class is within the next 60 minutes — indigo bg, white text, shows classroom.

### Cards — canonical spec
- `background: var(--bg-surface)`, `border: 1px solid var(--border-1)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-xs)`.
- On hover (if clickable): `shadow-sm`, translateY(-1px), border picks up `--cyan-200`.
- **Never** gradient fills. **Never** colored left-border accents (we use badges instead).
- Language cards have a **language flag in top-right** and a **2px colored top-border** in the language's assigned color (see ICONOGRAPHY).

---

## ICONOGRAPHY

### Primary icon set: **Lucide**
- Loaded from CDN (`https://unpkg.com/lucide-static/` or `lucide-react`).
- Stroke style, 1.75px stroke, 24px default. Matches Believe's open / airy feel.
- All icons inherit `currentColor` — color is set by context.
- **Flagged substitution:** Believe's marketing site uses WordPress default iconography (Dashicons), which is inconsistent. We've swapped to **Lucide** for cohesion. If a custom icon set exists in Yantra's Figma, please share.

### Language identity (not an icon system — a visual primitive)
Each language gets a **flag emoji + assigned accent color** used on cards, schedules, badges:

| Language | Emoji | Accent |
|---|---|---|
| Inglés | 🇬🇧 | `#0693E3` brand-cyan |
| Francés | 🇫🇷 | `#025C9B` brand-blue |
| Alemán | 🇩🇪 | `#2A313B` neutral-700 |
| Italiano | 🇮🇹 | `#16A34A` success-green |
| Portugués | 🇧🇷 | `#FCB900` brand-yellow |
| Chino Mandarín | 🇨🇳 | `#CF2E2E` brand-red |
| Japonés | 🇯🇵 | `#971F1F` red-700 |
| Español | 🇪🇸 | `#FCB900` + `#CF2E2E` split |

Emoji flags are always **paired with a text label** — never alone. They're cultural markers, not navigation.

### Logo
The official wordmark (`assets/logo-believe.svg`) is Alejandro's set wordmark — angular lowercase "believe" with a soaring "b". Rules:
- Minimum width 96px on dark, 80px on light.
- 24px clear space on all sides.
- **Don't recolor**, don't stretch, don't add gradients. Use as-is on light; for dark surfaces, swap to a white variant (to be produced).

### Emoji
- **Flags** ✅ (as above, paired with labels)
- **Everything else** ❌
- Never use 🎉 ✨ 🚀 😀 etc. — it dilutes the brand and clashes with the educational tone.

### Unicode marks
- `→` right-arrow for "next" / navigation chevrons (as alternative to Lucide's `ArrowRight`).
- `•` middle-dot as meta separator.
- `©` in footer.
- No other decorative unicode.

---

## How to use this system

1. Import the CSS: `<link rel="stylesheet" href="colors_and_type.css">`.
2. Use CSS vars (`var(--cyan-500)`, `var(--space-4)`, etc.) rather than hard-coding.
3. Reach for the UI kit components in `ui_kits/portal/` before inventing.
4. When in doubt, ask: "Would Alejandro say this? Would a student feel warm reading it?"

### Known gaps (open for iteration)
- **Font file substitution** — using Manrope; flag to user for the intended brand face.
- **Logo white-variant** not yet produced.
- **Imagery** — we couldn't download Believe's stock photography (sandbox CORS); UI kit uses placeholders with a warm-toned indigo gradient stand-in. Please drop real classroom photos into `assets/photos/` when available.
- **Icon set** — swapped Believe's inconsistent WP icons for Lucide. Revisit if Yantra has a spec'd set.
- **Third-party brand assets** (Yape / Plin / BCP logos) — referenced by name only; add official SVGs to `assets/payment/` before shipping.

---
name: believe-academy-design
description: Use this skill to generate well-branded interfaces and assets for Believe Academy (language school in Arequipa, Perú), either for production or throwaway prototypes/mocks. Contains brand guidelines, colors, type, fonts, assets, and a 5-role portal UI kit (Estudiante / Profesor / Recepción / Dueño / Finanzas).
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. Use `colors_and_type.css` as the single source of truth for tokens, and import `ui_kits/portal/Primitives.jsx` when you need components like Button, Card, Sidebar, Badge, Avatar, or the `LANGS` language-meta map.

If working on production code, copy assets, adopt the tokens into the real codebase, and use the README's CONTENT FUNDAMENTALS / VISUAL FOUNDATIONS / ICONOGRAPHY sections as the design contract.

If the user invokes this skill without other guidance, ask them:
1. Which role(s) are we designing for? (Estudiante, Profesor, Recepción, Dueño, Finanzas)
2. Is this production code or a throwaway mock/prototype?
3. Any specific flow (reservar clases, asistencia QR, aprobar pagos, etc.)?

Then act as an expert designer who outputs HTML artifacts or production code, depending on the need. Remember: Believe's voice is warm + proud + declarative, first-person plural on marketing, informal *tú* in-app, UPPERCASE eyebrows, NO decorative emoji (flags only, paired with labels).

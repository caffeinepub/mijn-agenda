# Design Brief

**Tone & Purpose**: Personal Dutch calendar — intimate, focused, refined editorial aesthetic. Month view is primary and fills the viewport. Continuous month flow with clean grid layout and subtle interactions.

## Palette (OKLCH)

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Primary | 0.58 0.16 79 (warm amber) | 0.72 0.14 70 | Today, events, accents |
| Secondary | 0.92 0.02 264 (light gray) | 0.22 0.01 264 | Subtle backgrounds |
| Background | 0.97 0.01 264 | 0.15 0.01 264 | Page & card surfaces |
| Foreground | 0.25 0.03 264 | 0.92 0.02 264 | Text & borders |
| Muted | 0.92 0.02 264 / 0.55 0.02 264 | 0.22 0.01 264 / 0.55 0.02 264 | Day numbers, hints |

## Typography

| Layer | Font | Usage |
|-------|------|-------|
| Display | Fraunces (serif, 700) | Month header, semantic emphasis |
| Body | DM Sans (sans-serif, 400/500) | Calendar grid, event labels, UI |
| Mono | Geist Mono (monospace, 400) | Time, technical content |

## Shape & Depth

- **Radius**: Minimal (4px on cards, 2px on day cells)
- **Borders**: 1px solid on day cells, subtle gray borders
- **Shadows**: None — elevation through background color and borders only
- **Card**: White (light) / dark-gray (dark) on soft background

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | Border-bottom, month title in display font | Month/navigation context |
| Grid | 7×6 day cells, equal height, border-left accent on today | Calendar matrix, fills viewport |
| Day Cell | Minimal padding, day number top-left, event badge bottom-right | Date reference + event count |
| Event Detail | Card panel with modal/drawer, form for add event | Event management |

## Component Patterns

- **Day Cell**: Rounded-sm, 1px border, hover state via secondary background. Today cell: warm amber left border (4px), soft background wash.
- **Event Badge**: Inline pill (px-1.5 py-0.5), warm amber background, rounded-sm, semibold text (xs).
- **Interaction**: All transitions via smooth cubic-bezier (0.4, 0, 0.2, 1).

## Signature Detail

Today's cell features a **warm amber left border** (4px, primary color), distinguishing it from other dates without visual noise. Event count badges in amber reinforce the calendar's functional purpose — showing at a glance which days have activity.

## Constraints

- No decorative animations; focus on clarity and legibility.
- Month fills available viewport height; continuous scroll between months.
- Personal-only calendar; no sharing or collaboration UI.
- Event form minimal (title + optional description); no time selection or categories.

## Motion

Smooth transitions (0.3s) on hover and state changes. No entrance animations. Focus on responsive interaction feedback.


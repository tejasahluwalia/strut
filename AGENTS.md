# Strut Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing
to build it out.

## Commands

```sh
deno install
deno task dev
deno task start
deno task test
deno task typecheck
```

## Building Features

Refer to ./.agents/skills/remix/SKILL.md

## References and Styling

- **Tailwind Templates:** You can find UI templates in
  `~/Desktop/Code/Templates`. Use these templates as references and inspiration
  when making new components.
- **CSS Implementation:** Even though the templates are built with Tailwind and
  React, they MUST be implemented in this project using Remix's provided way of
  working with Vanilla CSS. Do not use Tailwind directly.
- **Design Tokens:** The project uses Shadcn-style design tokens defined as CSS
  variables using HSL values. These are located in `public/global.css` (linked
  in `app/ui/document.tsx`). Use these variables (e.g., `hsl(var(--primary))` or
  `hsl(var(--primary) / 0.5)`) when styling components to maintain a consistent
  theme and support dark mode out of the box.

## Starter Layout

- `app/actions/` contains controllers and their associated page components
  (e.g., `home.tsx`, `about.tsx`). It is structured to mirror the nested routes
  defined in `app/routes.ts`.
- `app/routes.ts` defines the route contract.
- `app/router.ts` wires routes to route handlers (e.g.,
  `router.map(routes.admin, adminController)`).
- `app/middleware/` contains request-scoped middleware (like renderers, session,
  database loaders, etc.).
- `app/ui/` holds ONLY shared, reusable UI components (e.g., `document.tsx`,
  `layout.tsx`, `button.tsx`). It should NOT contain page-specific components.
- `app/data/` is used for database schemas and setup.
- `app/utils/` is used for utility functions and helpers.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route
  and renderer.
- `public/` contains static files served from the app root.

## Route Ownership

- Start from `app/routes.ts` and map each route to the narrowest owner on disk.
- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` for nested route maps that need
  their own actions or middleware.
- Keep route-owned page modules directly in `app/actions/` next to the
  controller that owns them (e.g., `app/actions/home.tsx` next to
  `app/actions/controller.tsx`).
- Move shared UI components to `app/ui/`, but keep page layouts and
  route-specific UI in `app/actions/`.

## Build-Out Notes

- This starter intentionally begins small; build out directories like
  `app/data/`, `app/utils/`, and `test/` following the demo patterns.
- Prefer putting code in the narrowest owner before introducing shared modules.
- Avoid generic dumping-ground directories like `app/lib/` or `app/components/`.

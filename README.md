# Ketze Studio

A bilingual interactive desktop portfolio built with React, TypeScript, Vite and Lucide React. Uses the supplied logo with a red, black and gray palette.

## Run

- `npm ci`
- `npm run dev`
- `npm run build` checks TypeScript and produces `dist/`.
- `npm run preview` serves the production build locally.

## Model–View–Presenter

- `src/models/`: typed project content, window state, preferences and app registration.
- `src/presenters/`: React hooks for desktop lifecycle, dragging/resizing, avatar customization/export and tools. They own state and actions.
- `src/views/`: React components that display presenter state and invoke actions.
- `src/components/`: shared window chrome and actions.

To add an application, create a view and, when needed, its presenter. Register its title, Lucide icon and component in `appRegistry.tsx`. Set `launcher: true` to include it in the desktop and dock. The window manager does not need to change. Project windows are registered from the typed project data.

All interface icons come from `lucide-react`. The user-supplied brand logo and the interactive SVG avatar are content, not custom interface icons. The avatar playground is an independent demonstration inspired by faceshape-react, not an embedded copy of that library.

## GitHub Pages

A workflow builds and deploys `dist/` on pushes to `main`. Select **GitHub Actions** as the Pages source. Vite uses relative asset paths for repository subpaths and custom domains.

## Privacy and publication

CV PDFs are excluded from the public repository. Visitors can request the CV by email. No backend is needed; developer-tool input stays in the browser.

## Code quality

ESLint checks TypeScript and React Hooks. Prettier formats TypeScript, TSX, CSS, HTML, JSON and project configuration.

```sh
npm run lint          # Check code and React Hooks
npm run lint:fix      # Apply available lint fixes
npm run format        # Format the project
npm run format:check  # Check formatting without changing files
npm run check         # Lint, formatting and production build
```

GitHub Actions runs lint and formatting checks before building and deploying. In VS Code or Cursor, install the recommended ESLint and Prettier extensions to format on save and show diagnostics while editing.

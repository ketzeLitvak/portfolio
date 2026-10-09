# Ketze Studio

A bilingual interactive desktop portfolio built with React, TypeScript, Vite and Lucide React. Uses the supplied logo with a red, black and gray palette.

## Run

- `npm ci`
- `npm run dev`
- `npm run build` checks TypeScript and produces `dist/`.
- `npm run preview` serves the production build locally.

## Model–View–Presenter

- `src/models/`: typed project content, window state, preferences and app registration.
- `src/presenters/`: React hooks for desktop lifecycle, dragging/resizing, avatar customization/export and interactive experiments. They own state and actions.
- `src/views/`: one view per file, grouped by feature (`desktop`, `projects`, `experience`, `avatar`, `search`, and individual experiments). Feature components and their CSS Modules live alongside the view.
- `src/components/`: reusable actions, accessible keyboard-operated tabs, and option popovers. Desktop window chrome lives in `views/desktop/components/`.

To add an application, create a view and, when needed, its presenter. Register its title, Lucide icon and component in `appRegistry.tsx`. Set `launcher: true` to include it in the desktop and dock. The window manager does not need to change. Project windows are registered from the typed project data.

All interface icons come from `lucide-react`. The user-supplied brand logo and the interactive SVG avatar are content, not custom interface icons. The avatar playground and saved desktop characters use the published `faceshape-react` dependency.

## GitHub Pages

A workflow builds and deploys `dist/` on pushes to `main`. Select **GitHub Actions** as the Pages source. Vite uses relative asset paths for repository subpaths and custom domains.

## Privacy and publication

The CV downloads are supplied PDF assets. Avatar preferences and interactive experiments stay in the browser; the portfolio does not need a backend.

## Code quality

ESLint checks TypeScript and React Hooks. A local, tested spacing rule inserts blank lines between imports and around function definitions, including arrow functions inside presenters. Prettier formats TypeScript, TSX, CSS, HTML, JSON and project configuration.

```sh
npm run lint          # Check code and React Hooks
npm run lint:fix      # Apply available lint fixes
npm run format        # Format the project
npm run format:check  # Check formatting without changing files
npm run check         # Lint, lint-rule tests, formatting and production build
```

GitHub Actions runs lint and formatting checks before building and deploying. In VS Code or Cursor, install the recommended ESLint and Prettier extensions to format on save and show diagnostics while editing.

## Direct links

Share a specific project, experience or desktop application using a URL fragment:

- `#project=radix` opens Radix.
- `#experience=geopagos` opens the Geopagos experience tab.
- `#experience=utn` and `#experience=leadership` open the other experience tabs.
- `#app=avatar` opens the avatar lab.

Use the link icon in a window title bar or **Copy link** in its context menu. Experience links follow the selected tab. Invalid fragments are ignored. If clipboard access is unavailable, the interface displays a selectable link for manual copying.

## Component and style ownership

Each screen lives in its own feature folder. `DesktopWindow` owns the shared window frame, while `WindowTitleBar` renders its controls. `Tabs` owns tab keyboard navigation; the experience presenter owns the selected experience. `ExperimentHeader`, `ExperimentExplanation`, `OptionsPopover` and `OptionChoices` keep repeated experiment UI in one place. `ApplicationIcon` and `DesktopShortcut` share desktop icon rendering.

Use a colocated `.module.css` file and import its classes as `styles`. Shared content utilities live in `styles/Content.module.css`; `styles/global.css` contains theme variables, resets, typography and base form styles only. Modules reference another component's scoped classes through ICSS imports where a parent layout needs to size its children. They do not expose feature classes globally. Behavior uses data attributes or ARIA roles instead of styling class names.

To add a screen, create its feature folder, view, CSS Module and optional presenter, then register it in `models/appRegistry.tsx`. Run `npm run lint:fix` and `npm run format` before `npm run check`.

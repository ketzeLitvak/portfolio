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
npm run check         # Lint, model and lint-rule tests, formatting and production build
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

## Interactive experiments

Independent desktop apps: caching, permissions, events, concurrency, circuit breakers, rate limiting, database indexes, event sourcing, hashing, encryption, digital signatures, dependency injection, load balancing, distributed tracing, database migrations and idempotency. Experiment icons start in the rightmost columns and can be dragged like the other shortcuts.

Rate limiting compares fixed windows, sliding windows and token buckets with an explicit virtual clock and separate client quotas. The index example compares linear scanning with binary lookup over an ordered key-to-row mapping; it illustrates the idea without claiming to emulate a database B-tree. Event sourcing reconstructs a cart from an append-only history and records undo as a compensating event.

Cryptography uses the browser's Web Crypto API: SHA-256 fingerprints, PBKDF2 password derivation with random per-account salts, AES-GCM authenticated encryption and ECDSA signatures. Keys are generated locally for each demonstration and discarded when the window is closed; private keys are not exportable. These apps need a secure context (HTTPS or localhost). No entered messages or passwords are sent to a server.

Share any experiment using `#app=rate`, `#app=indexes`, `#app=sourcing`, `#app=hashing`, `#app=encryption` or `#app=signatures`. `ExperimentWorkbench`, `ExperimentClock`, `HexValue` and scoped workbench utilities keep the common UI reusable. Algorithms live in the models, interaction state in presenters and each feature view has its own CSS Module.

The dependency injection app (`#app=injection`) wires a shipping provider into the checkout constructor. Standard and express providers quote by weight; a test stub returns a fixed response. The checkout delegates through the shared contract. Tests independently inject a spy and verify order forwarding, alongside composition and stub behavior.

Load balancing (`#app=balance`) compares round robin with least active connections across three simulated servers. A controllable clock completes requests; stopped servers fail active work and are excluded from new routing. Tracing (`#app=tracing`) displays nested API, auth, payments and database spans with shared trace context, correlated logs and slow/error scenarios.

Migrations (`#app=migrations`) applies a nullable column, backfill and NOT NULL constraint in order. Injected transaction failures leave both version and data unchanged; down migrations explicitly show destructive email removal. Idempotency (`#app=idempotency`) stores payment responses by key, replays identical retries, rejects changed amounts and illustrates a lost response after a successful charge. These four apps are local models, with independent algorithm tests.

## Pixel Studio

The drawing app (`#app=drawing`) supports a custom square canvas from 1 to 1024 pixels per side, pencil, eraser, four-connected flood fill, color picker, palette and a hand tool for panning. Zoom reaches 16×. Canvas rendering and preview use native pixels and nearest-neighbor display rather than per-pixel DOM elements. Resizing preserves the top-left area; smaller sizes crop pixels and can be undone.

Pointer capture and line interpolation support mouse, pen and touch strokes, with one undo operation per stroke. History is bounded by 40 entries and an 8-million-pixel budget. The current document is validated and saved as run-length encoded data in local storage after a stroke; storage failures are visible. Legacy 16/32 pixel documents are still accepted. PNG exports use the chosen native dimensions and preserve transparency.

Save up to five drawings as desktop characters, independently of the avatar collection. Sprite images trim transparent margins, retain a name and persist their dragged position. Drawings and FaceShape avatars share the same drag, keyboard movement and close-button component. Avatars retain mouse tracking and blinking. There is no wallpaper customization.

Basic apps, projects and experiences fill the left columns continuously. Experiments fill from the right, leaving any partial column at the left edge of that group. Rate limiting and database indexes remain in the far-right column; explicit dragged positions are preserved.

## Architecture explorer

The architecture app (`#app=architecture`) starts with Radix and is also accessible from its project detail. Seven interactive components describe responsibilities, inputs, outputs and documented design decisions. A manual four-step walkthrough highlights how the web reads a prepared location score through the API and operational data store. The responsive connector map follows the actual card layout; keyboard tabs, English/Spanish content and theme variables are shared with the desktop.

The map represents a simplified logical view from Radix’s architecture document V1.0 (July 2026), not an assertion about current physical deployment. The analytical Gold layer and operational store are distinguished by responsibility. Reports, alerts and score import are grouped as background processing. The explorer has separate model, presenters and scoped feature components; additional projects can supply the same data contract.

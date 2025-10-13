# Expense Manager

Expense Manager is a full-featured React + TypeScript web application for coordinating shared household finances. It provides authenticated users with tools to capture expenses (with receipt uploads), manage houses and stores, monitor balances, and visualise spending through interactive dashboards. The project is paired with Capacitor so the exact same codebase can target Android and iOS.

## Highlights
- **House-centric budgeting** – organise expenses by households, invite members, and track contributions per user.
- **Rich expense capture** – categorise costs, attach receipts with zoom/download support, and keep stores in sync.
- **Insights at a glance** – visual dashboards built on Recharts and MUI DataGrid summarise balances, trends, and categories.
- **Multi-theme experience** – dark, normal, and high-contrast themes with automatic system detection and manual overrides.
- **Cross-platform ready** – Capacitor integration enables native builds while Vite powers lightning-fast web development.

## Tech Stack
- **Frontend**: React 18, TypeScript, React Router, React Hook Form, MUI, Recharts, React-Chartjs-2, Framer Motion.
- **Styling**: SCSS modules, CSS variables via `ThemeContext`, Tailwind tooling (PostCSS, Autoprefixer).
- **Infrastructure**: Vite build tool, ESLint (TypeScript rules), Capacitor (Android, iOS, web).
- **Utilities**: Axios for API calls, React Toastify and custom Toaster for UX feedback, Capacitor Device/Preferences for native capabilities.

## Project Structure
```
src/
  components/         # Reusable UI (forms, charts, navigation, modals)
  context/            # Theme provider and global contexts
  hooks/              # Custom hooks (e.g., authentication)
  pages/              # Route-level screens (Expenses, Houses, Balances, etc.)
  styles/             # Global styles and theme variables
  utils/              # Config constants, helpers, currency utilities
public/               # Static assets, manifest, icons
capacitor.config.ts   # Capacitor project settings
```

## Getting Started
### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or Yarn 1.x
- For native builds: Xcode (iOS), Android Studio + Android SDK (Android)

### Installation
```bash
npm install
# or
yarn install
```

### Environment Variables
Create `.env.local` (or copy the provided example) with values for:
- `VITE_API_URL` – REST API base URL.
- `VITE_LOGO_URL` – remote image used in branding components.
- `VITE_WEATHER_API_KEY` – third-party weather integration.
- `VITE_SCRAPER_SECRET` – server-side scraping feature token.

> ⚠️ Never commit secrets to version control. Use platform-specific secure storage for production builds.

### Development
```bash
npm run dev
# Vite starts on http://localhost:5173 by default
```

### Quality Gates
```bash
npm run lint     # eslint with strict TS/React hooks rules
npm run build    # type-checks then emits production bundle
npm run preview  # serves the production build locally
```

## Capacitor Workflow
1. **Sync Web Assets**
   ```bash
   npm run build
   npx cap sync
   ```
2. **Run on Device/Emulator**
   ```bash
   npx cap run android
   npx cap run ios
   ```
3. **Open Native IDEs**
   ```bash
   npx cap open android
   npx cap open ios
   ```

Remember to re-run `npx cap sync` after any web asset change before building native binaries.

## Theming & Accessibility
- The default theme mirrors the user’s system preference via `prefers-color-scheme`, falling back to the normal theme.
- Selecting a theme manually persists the choice and decouples from system updates.
- Contrast mode provides high visibility colours, larger borders, and reduced shadows to aid accessibility.

## Contributing
1. Fork and clone the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Install dependencies and run `npm run lint` before submitting.
4. Open a pull request describing the change, screenshots for UI updates, and test notes.

## Troubleshooting
- **API issues** – confirm `VITE_API_URL` points to a reachable backend and that your auth token configuration matches server expectations.
- **Capacitor build failures** – ensure native platform dependencies are installed and the app bundle ID matches `capacitor.config.ts`.
- **Theme not updating** – clear local storage for the key `expense-manager-theme` to revert to system detection.

## License
This project is proprietary software. Please contact the repository owner for licensing or redistribution questions.

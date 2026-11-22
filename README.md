# Kasatria Periodic Table

**Live demo:** https://periodic-table-gold.vercel.app

## Features

- **Google Sign-In** in front of the app (Google Identity Services)
- **Live data** from a Google Sheet through the Google Sheets API v4
- **Person tiles**: country, age, photo, name and interest
- **Net worth colours**: red below $100K, orange from $100K to $200K, green above $200K, with a LOW to HIGH legend
- **Four animated layouts**:
  - Table, 20 × 10
  - Sphere
  - Double helix
  - Grid, 5 × 4 × 10
- **Drag to rotate, scroll to zoom**; the camera fits the scene to any screen size


## Tech stack

| Purpose | Library |
| --- | --- |
| UI | React 19, Vite |
| 3D | three.js (`CSS3DRenderer`, `TrackballControls`) |
| Animation | @tweenjs/tween.js |
| Routing | react-router-dom |
| Sign-in | @react-oauth/google |
| Styling | CSS Modules |

## Getting started

### 1. Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite)
- A Google Sheet with these columns in row 1: `Name`, `Photo`, `Age`, `Country`, `Interest`, `Net Worth`. Its sharing must be set to **Anyone with the link: Viewer**.
- A Google Cloud project with:
  - the **Google Sheets API** enabled
  - an **OAuth client ID** (Web application) whose authorized JavaScript origins include `http://localhost:5173`
  - an **API key** restricted to the Google Sheets API

### 2. Environment variables

| Variable | Description |
| `VITE_GOOGLE_CLIENT_ID` | OAuth client ID |
| `VITE_SHEETS_API_KEY` | API key for the Google Sheets API |
| `VITE_SHEET_ID` | The ID in the sheet's URL |
| `VITE_SHEET_RANGE` | Tab and cell range to read, e.g. `Data!A1:F` |

### 3. Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── components/
│   ├── common/
│   │   ├── LayoutControls/   TABLE / SPHERE / HELIX / GRID buttons
│   │   ├── NetWorthLegend/   LOW → HIGH colour bar
│   │   └── Tile/             builds one person tile as a DOM element for three.js
│   └── layout/
│       └── Header/           signed-in user and Logout
├── config/
│   ├── appConfig.js          API URL, sheet column names, timeouts, storage key
│   └── env.js                reads and validates the VITE_* variables
├── context/                  AuthContext + AuthProvider (signed-in user)
├── hooks/
│   ├── useAuth.js            reads the auth context
│   ├── useCss3dScene.js      camera, renderer, controls, animation loop, transform()
│   └── usePeople.js          loads people with loading, error and retry
├── pages/
│   ├── Login/                "Welcome Back" card with the Google button
│   ├── PeriodicTable/        the 3D scene page
│   └── Privacy/              privacy policy (public)
├── routes/                   AppRoutes + ProtectedRoute
├── services/
│   └── sheetService.js       fetches the sheet and maps rows to people
├── styles/globals.css
└── utils/
    ├── constants.js          colours, thresholds, scene and layout settings
    ├── decodeJwt.js          reads the Google ID token
    ├── layouts.js            the four layout functions
    └── netWorth.js           parses "$251,260.80" and picks the colour
```

## How it works

1. **Sign-in.** Google's button returns an ID token. `AuthProvider` decodes the name, email and photo and keeps them in `sessionStorage` until logout, the tab closes, or the token expires. `ProtectedRoute` sends signed-out visitors back to the login page.
2. **Data.** `sheetService` calls `GET /v4/spreadsheets/{id}/values/{range}?key=…`. It finds each column by its header name, so the column order doesn't matter, and turns every row into `{ name, photo, age, country, interest, netWorth }`.
3. **Scene.** `useCss3dScene` creates one `CSS3DObject` per person. Each tile is a real HTML element positioned in 3D with CSS transforms.
4. **Layouts.** Each layout function returns one target position and rotation per tile. `transform()` animates every tile to its target over 2–4 seconds, with a random duration per tile for the ripple effect.

### Layout maths (tile `i` of `n`)

| Layout | Position |
| --- | --- |
| **Table 20 × 10** | `column = i % 20`, `row = ⌊i / 20⌋`; x and y are spaced 140 × 180 and centred on the origin |
| **Sphere** | `φ = acos(−1 + 2i/n)`, `θ = √(nπ) · φ`, radius 800. This spreads tiles evenly over the sphere, each facing outward. |
| **Double helix** | `strand = i % 2`, `step = ⌊i / 2⌋`; `θ = step · 0.16 + strand · 135°`, `y = (center − step) · 16`, radius 900. Two strands turn the same way, offset by 135°. This gives the alternating wide and narrow gaps of DNA, which a single helix cannot produce. |
| **Grid 5 × 4 × 10** | `column = i % 5`, `row = ⌊i / 5⌋ % 4`, `layer = ⌊i / 20⌋`; spaced 250 × 250 × 350 and centred on the origin |

All sizes and spacings live in `src/utils/constants.js`.
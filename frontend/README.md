# 🎨 Portfolio — Frontend

The frontend of Subhodeep Mondal's personal portfolio, built with **React 18 + TypeScript + Vite**. It features a dark glassmorphism aesthetic, animated page transitions, and a contact form that communicates with the backend API.

---

## 📁 Folder Structure

```
frontend/
├── public/                  # Static assets (favicon, og-image, etc.)
├── src/
│   ├── assets/              # Images, SVGs
│   ├── components/          # Reusable UI components
│   │   └── ui/              # shadcn/ui primitives
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions (cn, etc.)
│   ├── pages/               # Route-level page components
│   │   ├── Index.tsx        # Home / hero page
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── test/                # Vitest unit tests
│   ├── App.tsx              # Root component + router setup
│   ├── main.tsx             # React DOM entry point
│   ├── index.css            # Global styles & design tokens
│   └── vite-env.d.ts
├── index.html               # HTML shell
├── vite.config.ts           # Vite configuration (alias @/ → src/)
├── tsconfig.json            # TypeScript project references
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-side TS config (vite.config)
├── eslint.config.js         # ESLint flat config
├── vitest.config.ts         # Vitest test config
└── package.json
```

---

## ⚙️ Setup & Development

### Prerequisites

- Node.js **v18+**
- npm **v9+**

### Install dependencies

```bash
cd frontend
npm install
```

### Start dev server

```bash
npm run dev
```

Runs at **http://localhost:8080** with hot module replacement.

### Build for production

```bash
npm run build
```

Output goes to `frontend/dist/`.

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm test           # run once
npm run test:watch # watch mode
```

---

## 🗺️ Path Alias

The `@` alias maps to `./src`, configured in both `vite.config.ts` and `tsconfig.app.json`:

```ts
import { useTheme } from '@/context/ThemeContext'
import { Button }   from '@/components/ui/button'
```

---

## 🌐 API Connection

The Contact page (`src/pages/Contact.tsx`) sends `POST` requests to the backend:

```
http://localhost:4000/api/contact
```

Make sure the **backend server is running** before testing the contact form locally.

---

## 🛠️ Key Tech

| Package               | Purpose                          |
|-----------------------|----------------------------------|
| `react` + `react-dom` | UI rendering                     |
| `react-router-dom`    | Client-side routing              |
| `react-hook-form`     | Form state management            |
| `zod`                 | Schema validation                |
| `@radix-ui/*`         | Accessible UI primitives         |
| `tailwindcss`         | Utility-first styling            |
| `lucide-react`        | Icon set                         |
| `sonner`              | Toast notifications              |
| `vitest`              | Unit testing framework           |

---

## 🎨 Design System

- **Theme**: Dark mode, glassmorphism cards, gradient accents
- **Typography**: Tailwind's default scale with Google Fonts
- **Colors**: Deep navy (`#1e1e2e`) background, indigo/violet accents
- **Animations**: CSS transitions + Tailwind animate plugin

---

## 👤 Author

**Subhodeep Mondal** — [GitHub](https://github.com/ShadowLegend007)

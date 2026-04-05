# 🌐 Subhodeep Mondal — Portfolio

A full-stack personal portfolio website built with **React + TypeScript** (frontend) and **Node.js / Express** (backend). Visitors can browse projects, skills, experience, and send messages directly through a contact form powered by a real email API.

---

## 📁 Project Structure

```
Portfolio/
├── frontend/          # React + Vite + TypeScript SPA
│   ├── src/           # Source code (pages, components, hooks, context)
│   ├── public/        # Static assets
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/           # Express.js email API server
│   ├── server.js      # Main server entry point
│   ├── .env           # Environment variables (not committed)
│   └── package.json
│
├── .gitignore
└── README.md          ← You are here
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### 1. Clone the repository

```bash
git clone https://github.com/ShadowLegend007/Portfolio.git
cd Portfolio
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev       # starts on http://localhost:4000
```

> See [`backend/README.md`](./backend/README.md) for environment variable setup.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:8080
```

> See [`frontend/README.md`](./frontend/README.md) for full details.

---

## 🛠️ Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS|
| UI       | shadcn/ui, Radix UI, Lucide Icons       |
| Backend  | Node.js, Express.js, Nodemailer         |
| Email    | Gmail SMTP (App Password)               |
| Routing  | React Router v6                         |
| Forms    | React Hook Form + Zod                   |

---

## 🌍 Features

- ⚡ Lightning-fast Vite-powered React SPA
- 🎨 Dark glassmorphism UI with smooth animations
- 📬 Contact form with real-time email delivery (to owner + visitor confirmation)
- 📱 Fully responsive across all screen sizes
- 🔗 Live project links and GitHub integration
- 🧪 Unit tests with Vitest

---

## 👤 Author

**Subhodeep Mondal**  
📍 Kolkata, West Bengal, India  
🔗 [LinkedIn](https://www.linkedin.com/in/subhodeep-mondal-a3a2762b5) · [GitHub](https://github.com/ShadowLegend007)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

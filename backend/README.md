# 📬 Portfolio — Backend

The backend for Subhodeep Mondal's portfolio contact form. A lightweight **Express.js** server that handles form submissions and delivers email notifications via **Gmail SMTP / Nodemailer**.

---

## 📁 Folder Structure

```
backend/
├── server.js        # Main Express server (all routes & email logic)
├── .env             # Environment variables — NOT committed to git
├── .gitignore       # Ignores node_modules & .env
├── package.json
└── package-lock.json
```

---

## 🔌 API Endpoints

| Method | Route           | Description                                 |
|--------|-----------------|---------------------------------------------|
| `GET`  | `/`             | Status page (HTML)                          |
| `GET`  | `/health`       | JSON health check (gmail user, pass length) |
| `POST` | `/api/contact`  | Submit contact form — sends 2 emails        |

### `POST /api/contact`

**Request body (JSON):**

```json
{
  "name":    "Jane Doe",
  "email":   "jane@example.com",
  "phone":   "+91 98765 43210",   // optional
  "message": "Hello Subhodeep!"
}
```

**Success response (`200`):**

```json
{ "message": "Emails sent successfully!" }
```

**On submission, two emails are sent:**

1. **Notification** → to the portfolio owner (you), with full form details
2. **Confirmation** → to the visitor, thanking them for reaching out

---

## ⚙️ Setup & Development

### Prerequisites

- Node.js **v18+**
- A Gmail account with a [16-character App Password](https://myaccount.google.com/apppasswords) (not your regular password)

### Install dependencies

```bash
cd backend
npm install
```

### Configure environment variables

Create a `.env` file in `backend/`:

```ini
# backend/.env
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASS=xxxx xxxx xxxx xxxx   # 16-char Gmail App Password (spaces OK)
PORT=4000                             # optional, defaults to 4000
```

> ⚠️ **Never commit `.env` to version control.**  
> The `.gitignore` in this folder already ignores it.

### Start development server (auto-restart on save)

```bash
npm run dev
```

Runs at **http://localhost:4000** using `nodemon`.

### Start production server

```bash
npm start
```

---

## 🔐 Gmail App Password Setup

1. Go to [Google Account → Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** → **Other** → name it `Portfolio`
5. Copy the generated **16-character password** → paste into `.env` as `GMAIL_APP_PASS`

---

## 🛠️ Key Tech

| Package      | Purpose                                    |
|--------------|--------------------------------------------|
| `express`    | HTTP server & routing                      |
| `cors`       | Cross-origin request handling              |
| `nodemailer` | Email sending via Gmail SMTP               |
| `dotenv`     | Load environment variables from `.env`     |
| `nodemon`    | Dev auto-restart on file change            |

---

## 🩺 Health Check

Visit `http://localhost:4000/health` to verify the server is connected to Gmail:

```json
{
  "status": "ok",
  "gmail": "your.email@gmail.com",
  "passLength": 16,
  "passOk": true
}
```

`passOk: true` confirms the App Password is exactly 16 characters.

---

## 🌐 CORS

The server allows requests from **any origin** (`cors({ origin: true })`). For production, restrict this to your deployed frontend URL:

```js
app.use(cors({ origin: 'https://your-portfolio-domain.com' }));
```

---

## 👤 Author

**Subhodeep Mondal** — [GitHub](https://github.com/ShadowLegend007)

# ☕ Brewlog Dashboard Frontend
## click this link to run the application https://brewlog-frontend-qsbz-bnhzqbo3i-bokamosomalope2-5709s-projects.vercel.app
A responsive, responsive single-page tracking dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React Icons**. This frontend interfaces directly with a cloud-hosted Spring Boot REST API to handle CRUD operations for custom coffee extractions.

## 🚀 Key Features

* **Full CRUD Pipeline:** Log, view, modify, and delete extraction parameters directly from the browser viewport.
* **Smart Request Context Routing:** Dynamic client-side routing automatically targets local testing ports (`http://localhost:8080`) when offline and pivots to cloud providers (Render) when built in production environments.
* **Modern Interface Engine:** Implemented with semantic Tailwind layers, featuring real-time rating star indicators, confirmation prompts, and an absolute input modal layout.
* **Production Build Caching Configuration:** Built-in rewrites for single-page applications to prevent routing 404 drops on server redeployments.

---

## 📂 Project Architecture

```text
my-brew-log/
├── package.json          # Dependencies and automation script paths
├── vite.config.js       # Vite bundler properties and Tailwind configurations
├── index.html            # Core HTML application container shell
├── vercel.json           # Vercel deployment rewrite rules for SPA support
└── src/
    ├── main.jsx          # React system mounting core entrypoint
    ├── index.css         # Tailwind directives and layer extensions
    ├── config.js         # REST endpoint context switching configuration
    └── App.jsx           # Core layout component, state machinery, and api calls
```

---

## 🛠️ Local Development Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18.x or newer) installed on your computer.

### 2. Install Project Dependencies
Clone this repository to your machine, move into the directory, and download your dependencies:
```bash
cd BrewLog
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to the printed local port (usually `http://localhost:5173`). 

> **Development Note:** The application looks for a local running Spring Boot instance on `http://localhost:8080` by default during local developer sessions.

---

## ☁️ Vercel Production Deployment Instructions

This frontend is configured for deployment to **Vercel**.

1. Commit and push all latest adjustments to your remote GitHub branch (`main`).
2. Log into the **[Vercel Dashboard](https://vercel.com)** and select **Add New > Project**.
3. Import this `Brewlog-Frontend` repository.
4. Expand the **Environment Variables** panel configuration row.
5. **Inject the Critical Variable Pipeline Setting:**
   * **Name / Key:** `VITE_API_URL`
   * **Value:** `https://onrender.com` *(Ensure this links to your live Render endpoint and explicitly contains the `/api/brews` route suffix)*
6. Click **Deploy**. Vercel will process the dependency tree and make your tracking app live.

---

## ⚙️ Environment Properties Specification

This layout leverages Vite-prefixed environment parameters. The client endpoint configuration `src/config.js` evaluates targets using this protocol:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/brews';
```

| Environment Property | Runtime Target Context | Execution Priority |
| :--- | :--- | :--- |
| `undefined` / Local Sessions | `http://localhost:8080/api/brews` | Fallback Priority |
| Built/Injected Production Env | `https://[your-service-subdomain]://` | Primary Execution |

---

## 📜 Standard Data Interface Layout (JSON payload)

The client architecture pushes standard structured, camelCase schema entities directly to the Spring REST receiver layers to ensure database properties map smoothly:

```json
{
  "beans": "Ethiopian Yirgacheffe",
  "method": "V60 Pourover",
  "coffeeGrams": 15,
  "waterGrams": 250,
  "rating": 5,
  "testingNotes": "Bright acidity, floral notes, clean bergamot tea finish."
}
```

# Real-Time Analytics Dashboard

A modern dashboard for real-time web analytics, featuring live data streaming, interactive charts, AI-powered insights, and robust role-based access.

---

## 🚀 Features

- **Real-time WebSocket data streaming**
- **Interactive charts** with filtering
- **AI-powered insights** and summaries
- **Role-based access control** (admin/viewer)
- **Data export** (CSV/PDF)
- **Responsive design**

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Chart.js  
- **Backend:** Node.js WebSocket, Firebase Auth, Firestore  
- **AI:** OpenAI API integration  
- **Deployment:** Vercel (frontend), Heroku (backend)

---

## 📦 Installation

```bash
git clone https://github.com/your-repo/analytics-dashboard.git
cd analytics-dashboard
npm install
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/        # UI components (Dashboard, SummaryBox, AskDataAssistant)
├── charts/            # Chart wrappers (PageViews, TopPages, UserFlows)
├── hooks/             # Custom hooks (e.g., useWebSocket)
├── services/          # API integrations (e.g., OpenAI)
├── authentication/    # Auth context and role logic
├── utils/             # Utility functions (exportCSV, trimMetrics)
```

---

## 🏗️ Architecture

![Architecture Preview](./src/assets/architecture%20(2).png)

---

## 🌐 Live Demo

View the deployed project:  
🔗 **[day3-orpin.vercel.app](https://day3-orpin.vercel.app)**

---

## 🧠 Workflow & Feature Breakdown

### 🔌 `useWebSocket` (Custom Hook)

Connects to a WebSocket server for real-time data.

- Connects to: `wss://sonar-lab-server-8881cb834ac4.herokuapp.com/`
- Maintains last 1000 `DataPoint` entries.
- Handles errors and cleanup.
- Supports site filtering via messages.
- Retries filter message until socket is ready.

---

### 📊 Dashboard Component

Central hub for live data, filters, AI tools, and role-based actions.

1. **Live Data Integration:** Uses `useWebSocket` for real-time/global data.
2. **Filtering:** Query param filtering (`?sites=site1,site2`).
3. **Charts:**  
  - `PageViewsLineChart` (page views over time)  
  - `TopPagesBarChart` (most visited pages)  
  - `UserFlowHeatMap` (user navigation flows)
4. **Data Aggregation:** Prepares data for charts.
5. **AI Summary:** `SummaryBox` generates executive summaries.
6. **AI Q&A:** `AskDataAssistant` for custom questions.
7. **Export Controls:** CSV/PDF export (admin only).
8. **Authentication:** Role-based UI, login/logout controls.

---

### 🤖 `queryDashboardAI` (Service)

Sends prompts and data to an OpenAI-powered backend.

- Converts analytics into natural language summaries/answers.
- Sends POST to `/api/openai` endpoint.
- Handles errors and logs for debugging.

---

### 🔐 AuthProvider & AuthContext

Handles login, logout, and role-checking via Firebase Auth + Firestore.

- Listens for auth state.
- Checks admin email list in Firestore.
- Exposes `{ user, role, logout }` context.
- Controls UI for admin/viewer roles.

---

### 💬 AskDataAssistant Component

Ask questions about the data and get AI-driven answers.

- User submits a question (e.g., "Which site had the most traffic last week?")
- Sends dashboard data + question to `queryDashboardAI`.
- Displays AI response.

---

## 📤 Deployment

- **Frontend:** Deployed to Vercel via `vercel.json`.
- **Backend:** Hosted on Heroku (WebSocket streaming, AI proxying).

---

## ⚙️ Dev & Tooling

- **Scripts:**
  - `npm install` — Install dependencies
  - `npm run dev` — Start local dev server
  - `npm run build` — Build for production
- **Code Quality:**
  - Type safety via `tsconfig.json`
  - ESLint for code style
  - Modular structure

**Dependencies:**

| Category      | Libraries                        |
| ------------- | -------------------------------- |
| UI            | React, TailwindCSS               |
| Type Safety   | TypeScript                       |
| State & Hooks | React Context, useState, useEffect|
| Charts        | Chart.js (or Recharts)           |
| Backend       | WebSocket, OpenAI API            |
| Auth          | Firebase (Auth + Firestore)      |
| Export        | FileSaver, jsPDF, CSV generation |

---

## 🧪 Example Prompts for AI

- "Which site had the highest traffic in the last 24 hours?"
- "What are the top 3 pages visited most frequently?"
- "Was there a sudden drop in user sessions this week?"
- "Generate a summary of bounce rate trends."

---

## 🏁 Future Improvements

- Add unit and integration tests
- Improve mobile responsiveness
- Pagination for historical data
- Auto-refresh toggle for WebSocket data
- Use OpenAI functions for structured results


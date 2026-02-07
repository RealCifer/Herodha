# Portfolio Dashboard

This repository contains a **Full Stack Portfolio Dashboard** built as par of personal peoject.  
The application displays portfolio-level and stock-level financial data, performs real-time calculations, and presents the results in a clean, responsive user interface.

The Project focuses on **correctness, clean architecture, scalability, and graceful handling of unreliable external data sources**.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

---

## Features Implemented

### Stock Portfolio Table
Displays the following for each stock:
- Stock symbol
- Stock name (Particulars)
- Exchange (NSE / BSE)
- Quantity
- Purchase price
- Current Market Price (CMP)
- Present value
- Gain / Loss (color-coded with indicators)
- Portfolio percentage contribution
- P/E Ratio (best-effort)
- Latest earnings (best-effort)

### Sector-wise Summary
- Groups stocks by sector
- Displays:
  - Total investment per sector
  - Total present value per sector
  - Sector-wise gain / loss

### Auto Refresh
- Portfolio data refreshes automatically every **60 seconds**
- No page reload required

### Visual Indicators
- Green for profits
- Red for losses
- Up / down arrows for quick trend recognition

---

## Backend Responsibilities

- Fetch financial data from external sources
- Perform all calculations server-side:
  - Investment
  - Present value
  - Gain / loss
  - Portfolio percentage
  - Sector aggregation
- Cache responses to reduce external API calls
- Handle partial or failed data gracefully
- Expose a clean REST API for the frontend

---

## Data Sources & Limitations

 **Important Note**  
Yahoo Finance and Google Finance do **not** provide official public APIs.

### Yahoo Finance
- Used for fetching **Current Market Price (CMP)**
- Requests are:
  - Cached
  - Rate-limited
  - Fallback-protected
- If data is unavailable, the system degrades gracefully

### Google Finance
- Used for fetching **P/E Ratio** and **Latest Earnings**
- Implemented via best-effort HTML parsing
- Failures are handled safely without injecting fake data

No mock or hardcoded financial values are used when APIs fail.

---

## Architecture Decisions

- Clear separation between frontend and backend
- All business logic handled on the server
- Frontend remains lightweight and declarative
- In-memory caching to improve performance and avoid rate limits
- Type-safe models used across layers conceptually
- Clean and maintainable folder structure

---

## Project Structure

root
│
├── portfolio-backend
│ ├── src
│ │ ├── routes # API routes
│ │ ├── services # External data fetching (Yahoo / Google)
│ │ ├── models # TypeScript models
│ │ ├── utils # Cache and helpers
│ │ └── index.ts # Server entry point
│ ├── package.json
│ └── tsconfig.json
│
├── portfolio-frontend
│ ├── app
│ │ ├── page.tsx # Main dashboard UI
│ │ └── lib # API client
│ ├── public
│ ├── package.json
│ └── tailwind.config.js
│
└── README.md


---

## How to Run the Project Locally

### Backend
```bash
cd portfolio-backend
npm install
npm run dev
http://localhost:5000


### Frontend
``` bash
cd portfolio-frontend
npm install
npm run dev
http://localhost:3000


### AUTHOR
``` bash
ADITYA KHAMAIT



# Product Review Analytics — Frontend

## Prerequisites

- Node.js >= 18

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in this directory:

```bash
cp .env.example .env
```

`.env` variables:

| Variable        | Description              | Example                                    |
|-----------------|--------------------------|--------------------------------------------|
| `VITE_BASE_URL` | Backend API base URL     | `http://localhost:5000/api`                |


### 3. Start the dev server

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

### 4. Build for production

```bash
npm run build       # outputs to dist/
```
## Project Structure

```
src/
├── components/
│   ├── Charts.jsx          # All 4 Recharts visualizations
│   ├── FileUpload.jsx       # Upload zone + delete all dialog
│   ├── ProductsTable.jsx    # Filterable, sortable, paginated table
│   └── SummaryCards.jsx     # KPI stat cards
├── services/
│   └── api.js              # Axios instance (reads VITE_BASE_URL)
├── store/
│   ├── index.js            # Redux store
│   ├── analyticsSlice.js   # Analytics data + thunks
│   ├── importSlice.js      # File upload state + thunk
│   └── productsSlice.js    # Products list, filters, pagination
├── App.jsx                 # Theme + layout
└── main.jsx                # React + Redux entry point
```
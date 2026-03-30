# Event Alerting Console
## Setup

**Backend**

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Runs on `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

**Frontend**

```bash
cd ui
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Stack

| Layer | Choice |
|---|---|
| Backend | Python, FastAPI |
| Data store | In-memory (dict) |
| Real-time | WebSocket (native `ws`) |
| Frontend | React 18, TypeScript, Vite |
| Styling | Plain CSS |
| Backend linting | Ruff |
| Frontend linting | ESLint + typescript-eslint |

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/alerts` | List all alerts (optional `?status=`, `?severity=`, `?channel=` filters) |
| `POST` | `/alerts` | Create a new alert |
| `GET` | `/alerts/:id` | Get a single alert with its full delivery event history |
| `POST` | `/alerts/:id/events` | Add a delivery event; broadcasts to all WebSocket clients |
| `WS` | `/ws` | WebSocket connection for real-time delivery event updates |

---

## Project Structure

```
api/
  main.py                  # FastAPI app, CORS config, router registration
  models.py                # Pydantic models: Alert, AlertSummary, DeliveryEvent, AlertDetail
  pyproject.toml           # Ruff linting config
  requirements.txt
  crud/
    alerts.py              # In-memory store + all CRUD operations
    data.json              # Seed data loaded on startup
  routers/
    alerts.py              # REST endpoints for alerts and delivery events
    websocket.py           # WebSocket connection management and broadcast

ui/src/
  App.tsx                  # Root component — owns global state, wires hooks to components
  types.ts                 # TypeScript types mirroring backend models + component prop types
  index.css                # All styles (no CSS framework)
  main.tsx                 # React entry point
  api/
    alert.ts               # Axios client for all REST calls
    websocket.ts           # WebSocket factory — connects and wires event callbacks
  hooks/
    useAlerts.ts           # Fetch + refetch all alerts
    useAlertDetail.ts      # Fetch a single alert with delivery events
    useCreateAlert.ts      # POST a new alert
    useCreateDeliveryEvent.ts  # POST a delivery event (simulate)
    useWebSocket.ts        # Manage WebSocket lifecycle, surface events to App
  components/
    AlertsTable.tsx        # Alerts list table with severity/status/event badges
    AlertDetailSlideout.tsx  # Right-side drawer: alert detail, event timeline, simulate
    CreateAlertSlideout.tsx  # Right-side drawer: create alert form
```

---

## AI Usage
AI used for this project:
- **ChatGPT**: Used for brainstorming, outlining project structure, and reminders of best practices/syntax/etc as an alternative to Google.
- **Copilot**: Autocomplete during coding.
- **Claude**:
    - Used for CSS to save time. 😅 I described the desired UI and interactions, and Claude generated the CSS for the slideout drawers and table styling.
    - Used as a sounding board for design decisions, like how to reconcile the REST and WebSocket sources of truth for the latest delivery state column, and whether to put error handling in hooks or components.
    - Used for code review. I asked Claude to audit the codebase against the requirements to identify any gaps before submission.
    - Used for linting setup. I asked Claude to configure ESLint and Ruff rather than doing it by hand.
    - Used partially for README. Claude generated the Setup/Stack/API/Project Structure sections based on the code, but I wrote the remaining sections myself.

---

## Design Decisions

### In-memory store

The requirements PDF specified there were two options for the data store: in memory or SQLite. I chose in-memory for simplicity and speed of development. There are two plain dicts that store the data: `_alerts` and `_events_by_alert`. The CRUD layer abstracts away data access, so swapping in a persistent DB later would be straightforward.

### Real-time state merging

In order to keep the "Latest Delivery State" column up to date in real time without refetching, the frontend merges the REST and WebSocket data sources. Instead of returning just the `Alert` objects, the list endpoint returns `AlertSummary` objects that include the latest delivery event. These are merged with incoming WebSocket events in the frontend to keep the table in sync.

### Toast for Error Display
The API error handling is centralized in the custom hooks rather than in components. Originally, I considered returning error states from the hooks and letting components decide how to render them. However, this would have added error state management and conditional rendering logic to multiple components, which would have cluttered the code and distracted from the main UI. Hooks now call `toast.error()` directly when an API call fails, so components can assume the happy path and focus on rendering the UI. A single `<Toaster />` component in `App.tsx` handles displaying all toast notifications across the app.

### Custom hooks per operation

Each data operation gets its own hook (`useAlerts`, `useAlertDetail`, `useCreateAlert`, `useCreateDeliveryEvent`, `useWebSocket`). This keeps each hook small and single-purpose, makes the data flow in `App.tsx` easy to follow, and makes each hook independently testable.

### Timestamps
The seed data provided used ISO timestamp strings, even though the requirements PDF mentioned milliseconds since epoch. To avoid confusion and keep things consistent, I chose to use ISO strings throughout the stack. In a production system, a consistent timestamp format should be defined and adhered to across the stack.

### Seed data loading
To load the seed data, I created a `data.json` file in the crud layer that is read on app startup. The in-memory store is populated with this data before the API starts accepting requests. 

---

## Tradeoffs

### In-memory store
The tradeoff here is simplicity vs persistence. The in-memory store was fast to implement and iterate on, but means all data is lost on server restart and doesn't support concurrent access. In production, a persistent database with proper concurrency control would be necessary.

### No WebSocket reconnection
If the WebSocket connection is lost, a Toast is displayed to the user but there is currently no attempt to reconnect. Implementing an exponential backoff reconnection strategy would improve resilience.

### Hardcoded `localhost` URLs
The API and WebSocket URLs are hardcoded for simplicity. In a real deployment, these would be environment variables to allow configuration against local, dev, production, etc.

### No pagination
Currently, the API returns all alerts in a single response. For the small number of seeded alerts, this is fine, but with a larger dataset, pagination either with offset or cursor-based would be necessary to avoid performance issues.

### No Authentication
The API is open and does not require any authentication. In a real system, some form of auth like API keys or JWT would be necessary to secure the endpoints and prevent unauthorized access.

---

## With more time...

### Retry logic for failed delivery events
To handle potential retries for failed deliveries, we could automatically schedule a retry sequence. One way to do this could be using a background task that waits for a short period of time and then creates a new `queued` -> `sent` chain for the alert. We could track the number of retries on the alert itself and cap at a configurable max to avoid infinite retries.

### Aggregate delivery counts by event type
Since the alert detail endpoint already returns the full list of events, computing the aggregate counts would be straightforward. One way to accomplish this would be to add an `event_counts` field to the `AlertDetail`, which would be a dict mapping each `EventType` to its count. This would be computed on the backend when the detail is fetched. We could also do this on the frontend by using a `useMemo` to group the events by type and count them, then render a summary row above the timeline showing something like "14 delivered - 2 failed - 1 read".

### Simulate multiple recipients with individual delivery states
To accomplish this, we could use the existing `recipient` field on the `DeliveryEvent` model to track which recipient each event corresponds to. The simulate endpoint currently accepts a single `recipient` str, but this could be modified to accept a list of recipients intead. The backend could then create a separate event for each recipient, all with the same `event_type` but different `recipient` values. These would then be broadcast individually. On the frontend, the event timeline in `AlertDetailSlideout` would be modified to group the events by recipient, rather than showing the singular timeline. 

### Websocket reconnect behavior
We could add a reconnect strategy inside the `useWebSocket` hook to handle dropped connections. When the `onClose` callback gets triggered, we could set a timeout to exponentially backoff and attempt reconnects with a max retry cap. During the reconnection, we could display a toast or banner indicating that live updates are paused. Once reconnected, we could optionally trigger a refetch of the alert list to reconcile any missed events during the downtime.

### Add table filtering
I added the backend support for filtering by `status`, `severity`, and `channel` via query params, but the frontend doesn't currently have any UI to set those filters. Adding dropdowns or multi-selects for each of those fields in the `AlertsTable` component would allow users to filter the list. The selected filter values would be stored in local state, and passed as query params when fetching the alerts.
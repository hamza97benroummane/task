# SOLUTION

## Backend
- **Security**: Replaced unsafe dynamic code in `middleware/errorHandler.js` with a standard 404 + centralized error handler.
- **Async I/O**: Converted blocking `fs.readFileSync/writeFileSync` in `routes/items.js` to `fs.promises` with `async/await`.
- **Search + Pagination**: `GET /api/items` now takes `q`, `page`, `pageSize` and returns `{ items, total, page, pageSize }`.
- **Stats caching**: `GET /api/stats` caches results keyed by the data file `mtime`, avoiding recompute on every request.
- **Configurable data path**: `process.env.DATA_PATH` lets tests use isolated temp files.
- **Tests**: Jest + Supertest cover items list, filtering, get-by-id, creation, and stats.

## Frontend
- **Memory leak fix**: Added `AbortController` in `Items.js` to abort in-flight fetch on unmount.
- **Data fetching**: `DataContext.fetchItems({ q, page, pageSize, signal })` uses the CRA proxy `/api`.
- **Pagination & Search**: Debounced input (300ms) and Prev/Next pager wired to server params.

## Trade-offs
- Kept utilities and routes minimal/idiomatic (no extra layers like repositories or DI).
- Cache invalidation uses file `mtime` to keep complexity low.
- Validation left simple to focus on the assessment objectives; can add `zod/express-validator` if needed.

## How to Run
```bash
# Terminal 1
cd backend && npm install && npm start 
# Terminal 2
cd frontend && npm install && npm start
```


## How to Test
```bash
# Terminal 1
cd backend && npm test
# Terminal 2
cd frontend && npm test


```
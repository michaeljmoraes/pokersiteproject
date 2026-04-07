# Crypto Betting Casino — Poker Site

A full-stack online poker platform with real-time gameplay, tournament support, and Web3 wallet integration (deposit/withdraw via BSC Testnet).

## Tech Stack

**Frontend:** React (CRA), Redux, React Router, Material UI, Tailwind CSS, ethers.js / useDApp, WebSocket

**Backend:** Node.js, Express, Sequelize ORM, MySQL, Passport JWT, WebSocket (ws)

---

## How to work

### Prerequisites

- Node.js 18+
- MySQL running locally **or** Docker Desktop

### Install

```bash
npm install --force
cd backend && npm install
```

### Database (Docker — recommended)

```bash
docker run -d \
  --name poker-mysql \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=txpoker \
  -p 3306:3306 \
  mysql:8.0 --default-authentication-plugin=mysql_native_password
```

The database schema is created automatically on first run via `sequelize.sync()`.

### Environment

Create `backend/.env` based on `backend/.env_example`:

```env
PORT=5600
API_USER="bba222"
API_PASSWORD="12345"
WalletAddress="0x..."
contractAddress="0x..."
```

### Run the web

```bash
# Run both frontend and backend together
npm start

# Or separately
npm run server        # backend only  → http://localhost:5600
npx react-scripts start  # frontend only → http://localhost:3000
```

> If port 3000 is occupied, set a different port: `PORT=3002 npx react-scripts start`

---

## Project Structure

```
/
├── src/                  # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level pages
│   ├── sections/         # Feature sections (home, tournament, wallet)
│   ├── redux/            # Redux slices and store
│   ├── contexts/         # Auth context (JWT)
│   └── utils/            # Axios instance, formatters, wallet connectors
├── backend/
│   ├── controllers/      # Express route handlers
│   ├── models/           # Sequelize models
│   ├── routes/           # API route definitions
│   ├── core/             # Game engine (Game, GameRoom, Round, User logic)
│   ├── middleware/       # Auth (Passport JWT), cache
│   └── config/           # DB, Passport, server config
└── package.json          # Root — runs both services via concurrently
```

---

## Running Tests

```bash
# Backend unit tests
cd backend && npm test

# Frontend tests
npm test
```

All 18 backend tests cover the core bug fixes: balance arithmetic, card sorting, input validation, WebSocket command names, and API path correctness.

---

## Bug Fixes — Assessment Summary

This repository was delivered as a bug-fix assessment. A total of **21 bugs** were identified and fixed across three areas:

### Frontend (5 bugs)
| File | Bug | Fix |
|------|-----|-----|
| `src/utils/axios.js` | API paths used relative `./api/` instead of `/api/` | Fixed to absolute paths |
| `src/components/games/Player.js` | `Player.protTypes` typo — PropTypes never registered | Corrected to `Player.propTypes` |
| `src/sections/tournament/currentTournaments.js` | WebSocket command `'get-tournamnet-list'` typo | Corrected spelling |
| `src/sections/tournament/currentTournaments.js` | Missing `return` after `navigate()` — navigation continued executing | Added `return` to short-circuit |
| `src/redux/slice/setting.js` | Duplicate export of `setThemeMode`/`setLanguage` caused runtime conflict | Removed duplicate export |

### Backend — Logic & Controllers (8 bugs)
| File | Bug | Fix |
|------|-----|-----|
| `AuthController.js` | `validResult.isEmpty` called without `()` — validation always bypassed | Added `()` |
| `TournamentController.js` | `findOne({id})` missing `where` clause — always returned null | Fixed to `findOne({where:{id}})` |
| `WebsocketController.js` | Room destroy hardcoded `id: 2` instead of `game.id` | Used dynamic `game.id` |
| `User.js` | Card sort comparator had reversed logic | Fixed sort direction |
| `TournamentController.js` | Multiple handlers missing `return` before `ResponseData.ok()` | Added `return` in 4 handlers |
| `MemberController.js` | `isEmpty` called without `()` — validation bypassed | Added `()` |
| `MemberController.js` | Login response returning `token` variable instead of `user.token` | Fixed to `user.token` |
| `MemberController.js` | Balance updated with string concatenation instead of arithmetic | Added `parseFloat()` |

### Runtime & Integration (8 bugs)
| File | Bug | Fix |
|------|-----|-----|
| `src/index.js` | `getDefaultProvider()` caused `NETWORK_ERROR`; broken RPC endpoint | Switched to `JsonRpcProvider` with explicit network + working endpoint |
| `src/utils/axios.js` | JWT never sent in `Authorization` header — all auth endpoints returned 401 | Added request interceptor |
| `src/pages/ChooseGames.js` | Unhandled promise rejection from pool fetch crashed page | Added try/catch |
| `backend/server.js` | `sequelize.sync()` commented out — tables never created on fresh install | Uncommented |
| `TournamentUser.model.js` | `defaultValue: ''` on INTEGER columns rejected by MySQL 8 strict mode | Changed to `null` |
| `Transaction.model.js` | `DataTypes.NUMBER` is not a valid Sequelize type — crashed server on sync | Changed to `FLOAT(10,2)` |
| `GameController.js` | `createGame` had no try/catch — unhandled rejection, no JSON response | Added try/catch |
| `GameController.js` | `getPool` executed a live blockchain transaction on every request — failed without testnet access | Removed blocking blockchain call; serves DB data directly |

---

## Pull Requests

| PR | Description |
|----|-------------|
| [#1](https://github.com/michaeljmoraes/pokersiteproject/pull/1) | fix: frontend bugs |
| [#2](https://github.com/michaeljmoraes/pokersiteproject/pull/2) | fix: backend bugs (controllers & logic) |
| [#3](https://github.com/michaeljmoraes/pokersiteproject/pull/3) | fix: backend bugs (MemberController & GameController) |
| [#4](https://github.com/michaeljmoraes/pokersiteproject/pull/4) | test: unit tests covering all bug fixes |
| [#6](https://github.com/michaeljmoraes/pokersiteproject/pull/6) | fix: runtime and full-stack integration bugs |

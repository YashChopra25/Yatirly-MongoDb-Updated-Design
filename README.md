# Yatirly

A URL shortener and QR code generator with click analytics. Anyone can shorten a link; signed-in users also get a dashboard with their link history and a breakdown of visits by month, browser, OS and device.

## Features

- **Short links**: paste a long URL and get a 10-letter short code.
- **QR codes**: styled QR codes with a colour palette, downloadable as SVG, PNG, JPEG or WebP.
- **Accounts**: sign up, log in and edit your profile. Sessions use a JWT stored in a cookie for 30 days.
- **Analytics**: every redirect records the visitor's browser, OS and device (parsed from the user agent), plus the visit time.
- **Dashboard**: overview charts, link history with visit counts, profile and settings.
- **Theming**: dark or light mode, with five accent colour schemes saved in the browser.

## Tech stack

| Layer    | Stack                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Redux Toolkit, React Router 7, Recharts, Framer Motion |
| Backend  | Node.js, Express 4, Mongoose 8 (MongoDB), JWT, bcrypt, ua-parser-js                                    |
| Testing  | Vitest, React Testing Library, Supertest, mongodb-memory-server                                        |

## Project structure

```
.
├── client/                 React frontend (Vite)
│   ├── src/
│   │   ├── api/            Axios instance (base URL, credentials, Bearer token)
│   │   ├── components/     UI: auth, dashboard, urlshortner, common, ui (shadcn)
│   │   ├── config/         Theme and QR code configuration
│   │   ├── context/        ThemeProvider / useTheme
│   │   ├── pages/          Login, Signup, Dashboard, Redirection
│   │   ├── slices/, store/ Redux auth state
│   │   └── utils/          ProtectedRoute, cookie token helper, icons
│   └── tests/              Client test suite (mirrors src/)
└── server/                 Express API
    ├── app.js              Express app (middleware + routes), no side effects
    ├── index.js            Entry point: loads env, connects to MongoDB, starts listening
    ├── config/             MongoDB connection
    ├── controllers/        User, URL and analytics handlers
    ├── middleware/         JWT auth middleware
    ├── models/             User, URL and Visit schemas
    ├── routes/, versions/  Routers mounted under /api/v1
    ├── dist/               Built frontend served by Express
    └── tests/              Server test suite
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database: a local `mongod` or a MongoDB Atlas connection string

### 1. Backend

```bash
cd server
npm install
cp .env.sample .env   # then fill in the values
npm run dev           # nodemon on http://localhost:3000
```

| Variable       | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `DATABASE_URL` | MongoDB connection string                                        |
| `JWT_SECRET`   | Secret used to sign auth tokens                                  |
| `CLIENT_URL`   | Frontend origin allowed by CORS, e.g. `http://localhost:5173`    |
| `PORT`         | Optional; defaults to `3000`                                     |

### 2. Frontend

```bash
cd client
npm install
cp .env.sample .env   # then fill in the values
npm run dev           # Vite on http://localhost:5173
```

| Variable            | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `VITE_BACKEND_URL`  | API origin, e.g. `http://localhost:3000`                             |
| `VITE_FRONTEND_URL` | Public origin used to build short links, e.g. `http://localhost:5173` |

Short links look like `VITE_FRONTEND_URL/<code>`. The frontend route `/:shortLink` resolves the code through the API and redirects the browser.

## Scripts

| Location  | Command              | What it does                          |
| --------- | -------------------- | ------------------------------------- |
| `server/` | `npm run dev`        | Start the API with auto-reload        |
| `server/` | `npm start`          | Start the API                         |
| `server/` | `npm test`           | Run the server test suite once        |
| `server/` | `npm run test:watch` | Run server tests in watch mode        |
| `client/` | `npm run dev`        | Start the Vite dev server             |
| `client/` | `npm run build`      | Type-check and build to `client/dist` |
| `client/` | `npm run lint`       | Run ESLint                            |
| `client/` | `npm test`           | Run the client test suite once        |
| `client/` | `npm run test:watch` | Run client tests in watch mode        |

## API reference

All routes are prefixed with `/api/v1`. Authenticated routes accept the `token` cookie set at login, or an `Authorization: Bearer <token>` header.

| Method | Route                   | Auth | Description                                                                           |
| ------ | ----------------------- | :--: | ------------------------------------------------------------------------------------- |
| GET    | `/`                     |      | Health check                                                                          |
| POST   | `/auth/user/create`     |      | Sign up. Body: `{ name, email, password }`                                            |
| POST   | `/auth/user/login`      |      | Log in and set the `token` cookie. Body: `{ email, password }`                        |
| GET    | `/auth/user/logout`     |      | Clear the `token` cookie                                                              |
| GET    | `/auth/user/verify`     |  ✓   | Return the current user                                                               |
| PUT    | `/auth/user/update`     |  ✓   | Update the name. Body: `{ first_name, last_name }`                                    |
| GET    | `/auth/user/fetch-urls` |  ✓   | The user's links, newest first, with `_count.visits`                                  |
| POST   | `/urls/create`          |  *   | Create a short link. Body: `{ longUrl, isQR? }`. *Linked to the user if the cookie is present |
| GET    | `/urls/:shortUrl`       |      | Record a visit and return `{ redirectOn: <longURL> }`                                 |
| GET    | `/analytics/fetch`      |  ✓   | Total visits, visits per month (current year), and browser/OS/device percentages      |

Responses use the shape `{ success, message, data? }`.

## Testing

Each app keeps its tests in a single `tests/` folder.

```bash
cd server && npm test   # 60 tests
cd client && npm test   # 86 tests
```

**Server (`server/tests/`)**: integration tests that send real HTTP requests to the Express app through Supertest. They run against an in-memory MongoDB from `mongodb-memory-server`, so no database setup is needed; the first run downloads a MongoDB binary. The tests cover sign-up, login, sessions, the auth middleware, profile updates, link creation and redirects, visit tracking, link history and analytics aggregation, plus the JWT and random-string helpers.

**Client (`client/tests/`)**: unit and component tests in jsdom with React Testing Library. The API is mocked with `vi.mock("@/api/axiosInstance")`. The tests cover the auth slice and `verifyUser` thunk, the axios interceptor, the theme context, route protection and redirects, the login and sign-up forms, link generation and copying, the short-link redirect page, profile editing, and the config and utility helpers. Shared render helpers are in `client/tests/test-utils.tsx`.

### Known issues (tracked as `it.fails`)

Three server tests are marked `it.fails`. Each one describes the correct behaviour for a bug that still exists, so the suite stays green. When a bug is fixed, its test starts passing, Vitest reports it, and the `.fails` marker should be removed.

1. **Duplicate sign-up returns 500 instead of 409.** `user.controller.js` checks for Prisma's `P2002` error code, but MongoDB reports duplicate keys as code `11000`.
2. **Sign-up with a missing field returns 500 instead of 400.** `validator.isEmpty(undefined)` throws.
3. **Profile update with only `first_name` returns 500.** `last_name.trim()` is called on `undefined`.

## Deployment

Both apps include a `vercel.json`. The Express server can also serve the built frontend: copy `client/dist` into `server/dist`, and any non-API route will return `index.html`.

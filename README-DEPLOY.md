# Deploy Instructions for Club Equipment Borrowing System

## 1) Local setup

From the repo root:
```bash
yarn install
```

Run frontend locally:
```bash
yarn start
```

Run backend locally:
```bash
cd server
yarn install
yarn build
yarn start
```

## 2) PostgreSQL schema

Import the database schema into PostgreSQL using the file below:
```bash
psql "$DATABASE_URL" -f database/schema.sql
```

If you use the Render PostgreSQL service, copy the provided `DATABASE_URL` from Render.

## 3) Render deployment setup

### Create services
1. Create a `PostgreSQL` database on Render.
2. Create a `Web Service` for backend.
3. Create a `Static Site` for frontend.

### Backend service settings
- Root directory: `server`
- Build command: `cd server && yarn install && yarn build`
- Start command: `cd server && yarn start`
- Environment variables:
  - `DATABASE_URL`
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`

### Frontend service settings
- Root directory: repository root
- Build command: `yarn install && yarn build`
- Publish directory: `dist`
- Environment variables:
  - `API_BASE=https://<your-backend>.onrender.com/api`

## 4) Render YAML

The repository includes `render.yaml` with the frontend and backend service definitions. Replace placeholder values in `render.yaml` with your actual URLs and secrets.

## 5) Routes configuration

Frontend navigation is configured in `config/routes.ts`:
- `/student/dashboard`
- `/student/devices`
- `/student/history`
- `/admin/requests`
- `/admin/devices`
- `/admin/stats`

## 6) How the API works

Frontend uses `src/services/api.ts` with `API_BASE`:
- `GET /api/equipments` — danh sách thiết bị
- `GET /api/requests` — yêu cầu trên toàn hệ thống
- `GET /api/requests/mine` — lịch sử người dùng
- `POST /api/requests` — tạo yêu cầu mượn
- `POST /api/requests/:id/approve` — duyệt yêu cầu (trừ tồn kho)
- `POST /api/requests/:id/return` — trả thiết bị (cộng tồn kho)
- `GET /api/me` — user demo

## 7) Notes
- The backend currently uses a placeholder user id (`user_id = 1`). For full authentication, replace that logic in `server/src/routes/request.ts`.
- Set `API_BASE` for the frontend to point at your backend service URL.
- If you use Render dashboard to store secrets, do not commit real passwords into `render.yaml`.

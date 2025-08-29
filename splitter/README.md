# Splitter

A modern Next.js app for splitting and tracking shared expenses with friends, roommates, and groups. Create expenses, split them equally or by custom amounts/percentages, track balances, settle up, and get insights.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript, React 19
- Tailwind CSS 4
- shadcn/ui + Radix primitives
- Prisma ORM with PostgreSQL
- Clerk authentication
- Inngest for background jobs
- Vercel Analytics
- Axios, React Hook Form, Zod

## Features
- **Authentication**: Sign up/in via Clerk under `(auth)` routes
- **Dashboard**: Overview of balances, groups, and spending trends
- **Expenses**: Create expenses, split equally/percentage/exact, categorize, and associate with groups or 1-to-1
- **Groups**: Create groups, add members, view group-level expenses and settlements
- **Contacts**: Search users to add to splits and groups
- **Settlements**: Record payments between users or within groups
- **Insights**: Monthly spending and balance summaries

## Project Structure
- `src/app`:
  - `(auth)`: Clerk `SignIn` and `SignUp` routes
  - `(main)`: Authenticated app (dashboard, expenses, groups, settlements, contacts)
  - `api`: Route handlers (REST-like) for expenses, dashboard, groups, user, contacts, settlements, inngest
  - `layout.tsx`: Global providers (`ClerkProvider`, `Toaster`, Vercel `Analytics`)
  - `page.tsx`: Marketing/landing page
- `src/components`: UI and feature components (dashboard, expenses, groups, settlements, contacts, `ui/*`)
- `src/lib`: Prisma client, controllers (business logic), common queries, utilities, email
- `prisma`: Prisma schema and seed data
- `hooks`: `useServerhook` (Axios data fetching), `useStorehook`

## Data Model (Prisma)
- `user`: Core user with `clerkId`, `email`, `name`, `imageUrl`
- `group` + `groupmembers` with `Role`
- `expenses`: expense with `splits[]`, `paidBy`, optional `groupId`, `category`, `date`
- `splits`: per-user split entries with `SplitType` (`equal`, `percentage`, `exact`) and `ispaid`
- `payments`: settlements between users, optional `groupId`

## API Overview
Selected routes (all under `src/app/api`):
- `user/currentuser` GET: Return the current stored user (Clerk-bound)
- `user/searchAllContacts` GET: Search users by name/email
- `expenses/createExpense` POST: Create an expense from `CreateExpenseInput`
- `expenses/getGroupmembers`, `expenses/getgroups`
- `dashboard/*`: `getuserspending`, `getusergroups`, `gettotalspending`, `getmonthlyspending`
- `group/*`, `person/*`, `settlements/*`, `contacts/*`
- `inngest` route for background functions

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Clerk account (publishable and secret keys)

### Environment Variables
Create a `.env` file in the project root:

```
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional
# RESEND_API_KEY=...
```

### Install and Setup

```bash
npm install
npm run prisma:generate # optional: postinstall runs prisma generate
npx prisma migrate dev
npx prisma db seed
```

If you don’t have `prisma:generate` in scripts, just run:

```bash
npx prisma generate
```

### Development

```bash
npm run dev
```
App runs on `http://localhost:3000`.

### Build and Start

```bash
npm run build
npm start
```

## Seeding
The repository includes `prisma/seed.ts` to populate sample users, groups, expenses, splits, and payments for local testing.

## Key Flows
- Expense creation: `POST /api/expenses/createExpense` → `src/lib/controllers/expenses.createExpense`
- Current user: `GET /api/user/currentuser` → `storeduser.getCurrentUser` (Clerk)
- Group balances: `src/lib/controllers/group.getGroupExpenses` computes per-member net and pairwise ledgers
- Dashboard: Client queries several `dashboard/*` endpoints via `useServerhook`

## Styling & UI
- Tailwind CSS is configured in `postcss.config.mjs` and `globals.css`
- Reusable UI components in `src/components/ui` (shadcn-style)

## Background Jobs
- `src/app/api/inngest/route.ts` exposes functions from `src/inngest/*` via Inngest

## Linting

```bash
npm run lint
```

## Conventions
- Use `src/lib/controllers/*` for server-side business logic
- API routes should be thin and delegate to controllers
- Keep Prisma data access in `src/lib/*`
- Keep shared types in `src/app/types.ts`

## License
MIT

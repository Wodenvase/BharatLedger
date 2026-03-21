# BharatLedger - Next.js Migration Guide

## ✅ Completed Steps

### 1. Next.js Project Setup
- ✅ Created new Next.js 15 project with TypeScript
- ✅ Configured Tailwind CSS
- ✅ Set up App Router structure
- ✅ Installed all dependencies (React, Lucide, Recharts, date-fns, Prisma)

### 2. Components Migration
- ✅ Copied all landing page components to `components/landing/`
- ✅ Copied all dashboard components to `components/dashboard/`
- ✅ Copied shared components (Navigation, InfoModal) to `components/shared/`
- ✅ Copied data, types, and utils directories

### 3. Routing Migration
- ✅ Landing page → `app/page.tsx`
- ✅ Dashboard overview → `app/dashboard/page.tsx`
- ✅ Transactions → `app/dashboard/transactions/page.tsx`
- ✅ Financial Health → `app/dashboard/health/page.tsx`
- ✅ Risk Simulator → `app/dashboard/simulator/page.tsx`
- ✅ Reports → `app/dashboard/reports/page.tsx`
- ✅ Profile → `app/dashboard/profile/page.tsx`

### 4. Prisma Setup
- ✅ Installed Prisma and Prisma Client
- ✅ Initialized Prisma with `npx prisma init`
- ✅ Created User model in `prisma/schema.prisma`
- ✅ Created Prisma client singleton in `lib/prisma.ts`
- ✅ Created `.env` template file

## 🚀 Next Steps (For You to Complete)

### Step 1: Create a Free PostgreSQL Database

Choose one of these free options:

#### Option A: Railway.app (Recommended)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Click on the PostgreSQL service
5. Go to "Connect" tab
6. Copy the "Postgres Connection URL"

#### Option B: Render.com
1. Go to https://render.com
2. Sign up for a free account
3. Click "New" → "PostgreSQL"
4. Fill in:
   - Name: bharatledger-db
   - Database: bharatledger
   - User: (auto-generated)
5. Click "Create Database"
6. Copy the "External Database URL"

#### Option C: Supabase (Alternative)
1. Go to https://supabase.com
2. Sign up and create new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)

### Step 2: Configure Database Connection

1. Open `.env` file in the Next.js project
2. Replace the DATABASE_URL with your actual connection string:

```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### Step 3: Push Schema to Database

Run this command to create the User table:

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs
npx prisma db push
```

This will create the `User` table with:
- `id` (String, auto-generated)
- `email` (String, unique)
- `password` (String, will be hashed)
- `name` (String, optional)
- `createdAt` (DateTime, auto-set)

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Test the Migration

Start the development server:

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 6: Fix Component Imports (If Needed)

The dashboard pages may need minor fixes. Check for:
- Import statements using `@/` paths (already configured)
- React.FC types converted to default function exports
- Any remaining relative path imports

### Step 7: Add Client/Server Directives

Next.js App Router requires 'use client' for interactive components. Add to files with:
- useState, useEffect, etc.
- Event handlers (onClick, onChange)
- Browser APIs

Example:
```tsx
'use client';

import { useState } from 'react';
// ... rest of component
```

Files that likely need 'use client':
- Navigation.tsx
- InfoModal.tsx
- All dashboard components with interactivity

## 📁 Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   └── dashboard/
│       ├── page.tsx            # Dashboard overview
│       ├── transactions/
│       │   └── page.tsx
│       ├── health/
│       │   └── page.tsx
│       ├── simulator/
│       │   └── page.tsx
│       ├── reports/
│       │   └── page.tsx
│       └── profile/
│           └── page.tsx
├── components/
│   ├── landing/                # Landing page sections
│   ├── dashboard/              # Dashboard widgets
│   └── shared/                 # Shared components
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── prisma/
│   └── schema.prisma          # Database schema
├── data/
│   └── mockData.ts            # Mock data
├── types/
│   └── index.ts               # TypeScript types
├── utils/
│   └── formatters.ts          # Utility functions
├── .env                        # Environment variables
└── package.json               # Dependencies
```

## 🔐 Database Schema

Current User model:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hash before storing!
  name      String?
  createdAt DateTime @default(now())
}
```

## 📝 Authentication Next Steps (Phase 2)

After completing Phase 1, you can add authentication:

1. Install NextAuth.js: `npm install next-auth bcryptjs`
2. Install types: `npm install -D @types/bcryptjs`
3. Create `app/api/auth/[...nextauth]/route.ts`
4. Add password hashing utilities
5. Create login/signup pages
6. Protect dashboard routes with middleware

## 🛠 Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx prisma generate        # Regenerate client
npx prisma migrate dev     # Create migration (for production)

# Type checking
npx tsc --noEmit
```

## 🐛 Common Issues & Solutions

### Issue: Import errors
**Solution**: Make sure `@/` path alias is working. Check `tsconfig.json` has:
```json
"paths": {
  "@/*": ["./*"]
}
```

### Issue: "Component is not a function"
**Solution**: Add `'use client'` to interactive components

### Issue: Prisma Client not found
**Solution**: Run `npx prisma generate`

### Issue: Database connection failed
**Solution**: Check DATABASE_URL format and network access to database

## 🎯 Phase 2 Preview (Next Steps After Phase 1)

1. **Authentication**: NextAuth.js with credentials provider
2. **API Routes**: Create endpoints for user operations
3. **Protected Routes**: Middleware to guard dashboard
4. **Password Hashing**: bcryptjs for secure storage
5. **Session Management**: JWT or database sessions
6. **User Registration**: Sign-up flow with validation

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

**Questions or issues?** Check the Next.js and Prisma docs, or review the migration checklist above.

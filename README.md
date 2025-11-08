# BharatLedger - Next.js Edition

> **Status**: Phase 2 Complete - Full Authentication System Live!

A comprehensive credit scoring platform for India's informal borrowers, powered by Next.js 15, PostgreSQL, Prisma, and NextAuth.js.

## Quick Start

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs

# If first time:
# 1. Add DATABASE_URL to .env (see QUICKSTART.md)
# 2. Run: npx prisma db push && npx prisma generate

# Start the app
npm run dev
```

Visit: **http://localhost:3000**

## What's New in Phase 2

### Complete Authentication System
- User registration with password hashing
- Secure login/logout with NextAuth.js
- Protected dashboard routes
- JWT session management
- Professional login & registration pages

### Try It Now:
1. Visit http://localhost:3000/register
2. Create an account
3. Sign in and access your dashboard
4. Protected routes automatically redirect to login

## Features

### Authentication & Security
- **NextAuth.js** - Industry-standard authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Stateless authentication tokens
- **Protected Routes** - Middleware-based route protection
- **Form Validation** - Client & server-side validation

### Frontend (Next.js 15)
- Landing page with all sections
- Dashboard with 6 routes (Overview, Transactions, Financial Health, Risk Simulator, Reports, Profile)
- Responsive navigation with auth state
- Tailwind CSS configured
- TypeScript throughout

### Backend (Prisma + PostgreSQL)
- Prisma ORM configured
- User model with authentication
- API routes for registration
- Database client singleton

## Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   └── register/              # User registration
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── dashboard/                 # Protected dashboard
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── landing/                   # Landing sections
│   ├── dashboard/                 # Dashboard widgets
│   └── shared/                    # Navigation, modals
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── prisma.ts                  # Database client
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Route protection
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  createdAt DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Password**: bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## Documentation

- **README.md** (this file) - Project overview
- **QUICKSTART.md** - 3-minute setup for Phase 1
- **PHASE2_COMPLETE.md** - Authentication guide & testing
- **MIGRATION_GUIDE.md** - Detailed migration from Vite to Next.js

## Usage

### Development
```bash
npm run dev        # Start dev server (localhost:3000)
```

### Database
```bash
npx prisma studio  # Open database GUI
npx prisma db push # Sync schema to database
npx prisma generate # Generate Prisma Client
```

### Build
```bash
npm run build      # Build for production
npm start          # Run production server
```

## Testing Authentication

### Create Account
1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Click "Create Account"
4. Redirected to login page

### Sign In
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign In"
4. Redirected to dashboard

### Test Protection
- Try accessing `/dashboard` while logged out
- Should redirect to `/login`
- After login, can access all dashboard routes

See **PHASE2_COMPLETE.md** for detailed testing guide.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

## Phase Completion Status

- **Phase 1**: Next.js migration + Prisma setup
- **Phase 2**: NextAuth.js authentication system
- **Phase 3**: Email verification, password reset, OAuth
- **Phase 4**: Real credit score calculation
- **Phase 5**: Transaction import & analysis

## What You've Built

### Phase 1 (Completed)
- Migrated React/Vite app to Next.js 15
- Set up PostgreSQL database
- Configured Prisma ORM
- Created User model

### Phase 2 (Just Completed)
- Installed & configured NextAuth.js
- Created registration API with password hashing
- Built login & registration pages
- Protected dashboard routes with middleware
- Updated navigation with auth state
- Implemented session management

## Troubleshooting

**Can't log in?**
- Check DATABASE_URL is correct
- Run `npx prisma generate`
- Clear browser cookies

**"NEXTAUTH_SECRET not set"?**
- Add to `.env` file
- Generate: `openssl rand -base64 32`

**TypeScript errors?**
- Restart TypeScript server in VS Code
- Run `npm install`

See documentation files for more help.

## License

Educational project for financial inclusion.

---

## You Now Have:

- Full-stack Next.js app
- PostgreSQL database
- Secure authentication
- Protected routes
- Professional UI/UX
- Password hashing
- Session management

**Ready to test?**
```bash
npm run dev
# Visit: http://localhost:3000
# Click "Get Started" to create your account!
```

**Happy coding!**

## Quick Start

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs

# If first time:
# 1. Add DATABASE_URL to .env (see QUICKSTART.md)
# 2. Run: npx prisma db push && npx prisma generate

# Start the app
npm run dev
```

Visit: **http://localhost:3000**

## What's New in Phase 2

### Complete Authentication System
- User registration with password hashing
- Secure login/logout with NextAuth.js
- Protected dashboard routes
- JWT session management
- Professional login & registration pages

### Try It Now:
1. Visit http://localhost:3000/register
2. Create an account
3. Sign in and access your dashboard
4. Protected routes automatically redirect to login

## Features

### Authentication & Security
- **NextAuth.js** - Industry-standard authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Stateless authentication tokens
- **Protected Routes** - Middleware-based route protection
- **Form Validation** - Client & server-side validation

### Frontend (Next.js 15)
- Landing page with all sections
- Dashboard with 6 routes (Overview, Transactions, Financial Health, Risk Simulator, Reports, Profile)
- Responsive navigation with auth state
- Tailwind CSS configured
- TypeScript throughout

### Backend (Prisma + PostgreSQL)
- Prisma ORM configured
- User model with authentication
- API routes for registration
- Database client singleton

## Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   └── register/              # User registration
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── dashboard/                 # Protected dashboard
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── landing/                   # Landing sections
│   ├── dashboard/                 # Dashboard widgets
│   └── shared/                    # Navigation, modals
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── prisma.ts                  # Database client
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Route protection
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  createdAt DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Password**: bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## Documentation

# BharatLedger - Next.js Edition

> **Status**: Phase 2 Complete - Full Authentication System Live!

A comprehensive credit scoring platform for India's informal borrowers, powered by Next.js 15, PostgreSQL, Prisma, and NextAuth.js.

## Quick Start

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs

# If first time:
# 1. Add DATABASE_URL to .env (see QUICKSTART.md)
# 2. Run: npx prisma db push && npx prisma generate

# Start the app
npm run dev
```

Visit: **http://localhost:3000**

## What's New in Phase 2

### Complete Authentication System
- User registration with password hashing
- Secure login/logout with NextAuth.js
- Protected dashboard routes
- JWT session management
- Professional login & registration pages

### Try It Now:
1. Visit http://localhost:3000/register
2. Create an account
3. Sign in and access your dashboard
4. Protected routes automatically redirect to login

## Features

### Authentication & Security
- **NextAuth.js** - Industry-standard authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Stateless authentication tokens
- **Protected Routes** - Middleware-based route protection
- **Form Validation** - Client & server-side validation

### Frontend (Next.js 15)
- Landing page with all sections
- Dashboard with 6 routes (Overview, Transactions, Financial Health, Risk Simulator, Reports, Profile)
- Responsive navigation with auth state
- Tailwind CSS configured
- TypeScript throughout

### Backend (Prisma + PostgreSQL)
- Prisma ORM configured
- User model with authentication
- API routes for registration
- Database client singleton

## Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   └── register/              # User registration
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── dashboard/                 # Protected dashboard
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── landing/                   # Landing sections
│   ├── dashboard/                 # Dashboard widgets
│   └── shared/                    # Navigation, modals
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── prisma.ts                  # Database client
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Route protection
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  createdAt DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Password**: bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## Documentation

- **README.md** (this file) - Project overview
- **QUICKSTART.md** - 3-minute setup for Phase 1
- **PHASE2_COMPLETE.md** - Authentication guide & testing
- **MIGRATION_GUIDE.md** - Detailed migration from Vite to Next.js

## Usage

### Development
```bash
npm run dev        # Start dev server (localhost:3000)
```

### Database
```bash
npx prisma studio  # Open database GUI
npx prisma db push # Sync schema to database
npx prisma generate # Generate Prisma Client
```

### Build
```bash
npm run build      # Build for production
npm start          # Run production server
```

## Testing Authentication

### Create Account
1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Click "Create Account"
4. Redirected to login page

### Sign In
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign In"
4. Redirected to dashboard

### Test Protection
- Try accessing `/dashboard` while logged out
- Should redirect to `/login`
- After login, can access all dashboard routes

See **PHASE2_COMPLETE.md** for detailed testing guide.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

## Phase Completion Status

- **Phase 1**: Next.js migration + Prisma setup
- **Phase 2**: NextAuth.js authentication system
- **Phase 3**: Email verification, password reset, OAuth
- **Phase 4**: Real credit score calculation
- **Phase 5**: Transaction import & analysis

## What You've Built

### Phase 1 (Completed)
- Migrated React/Vite app to Next.js 15
- Set up PostgreSQL database
- Configured Prisma ORM
- Created User model

### Phase 2 (Just Completed)
- Installed & configured NextAuth.js
- Created registration API with password hashing
- Built login & registration pages
- Protected dashboard routes with middleware
- Updated navigation with auth state
- Implemented session management

## Troubleshooting

**Can't log in?**
- Check DATABASE_URL is correct
- Run `npx prisma generate`
- Clear browser cookies

**"NEXTAUTH_SECRET not set"?**
- Add to `.env` file
- Generate: `openssl rand -base64 32`

**TypeScript errors?**
- Restart TypeScript server in VS Code
- Run `npm install`

See documentation files for more help.

## License

Educational project for financial inclusion.

---

## You Now Have:

- Full-stack Next.js app
- PostgreSQL database
- Secure authentication
- Protected routes
- Professional UI/UX
- Password hashing
- Session management

**Ready to test?**
```bash
npm run dev
# Visit: http://localhost:3000
# Click "Get Started" to create your account!
```

**Happy coding!**


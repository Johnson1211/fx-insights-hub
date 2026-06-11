# FXElite Pro

A premium full-stack forex trading community platform built with Next.js 14, MongoDB, and Stripe.

## Features

- **Premium Dark UI** with glassmorphism, gold accents, and animated forex ticker
- **Public Pages**: Landing, About, Services/Pricing, Signals Preview, Contact
- **Authentication**: JWT-based auth with bcrypt, register/login/logout
- **Member Dashboard**: Signals, Video Library, Profile, Settings
- **Admin Panel**: Signal management, User management, Content CMS
- **Stripe Integration**: Subscription checkout with webhook handling
- **Real-time**: Socket.io ready for live signals
- **Responsive**: Mobile-first design with bottom nav for dashboard

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT with refresh tokens, bcrypt
- **Payments**: Stripe Checkout + Webhooks
- **Real-time**: Socket.io (server setup ready)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd fxelite-pro
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- MongoDB URI
- JWT secrets
- Stripe keys
- Cloudinary keys (optional)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Seed Admin User

Create a user in MongoDB with `role: "admin"` to access the admin panel at `/admin`.

## Project Structure

```
fxelite-pro/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Register, Login, Logout, Me
│   │   ├── signals/      # Signal CRUD
│   │   ├── stripe/       # Checkout & Webhooks
│   │   └── admin/        # Admin APIs
│   ├── (public)/         # Public pages (no auth required)
│   │   ├── page.tsx      # Landing page
│   │   ├── about/
│   │   ├── services/
│   │   ├── signals/
│   │   ├── contact/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Member dashboard (auth required)
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── signals/
│   │       ├── videos/
│   │       └── profile/
│   └── admin/            # Admin panel (admin role required)
│       ├── page.tsx
│       ├── users/
│       ├── signals/
│       └── content/
├── components/
│   ├── public/           # Navbar, Footer
│   ├── dashboard/        # Sidebar, MobileNav
│   ├── admin/            # AdminSidebar
│   ├── animations/       # ScrollReveal, AnimatedCounter, ForexTicker
│   ├── ui/              # Toaster
│   └── AuthProvider.tsx
├── lib/
│   ├── db.ts            # MongoDB connection
│   ├── auth.ts          # JWT helpers
│   └── utils.ts         # Utility functions
├── models/              # Mongoose schemas
│   ├── User.ts
│   ├── Signal.ts
│   ├── Video.ts
│   ├── BlogPost.ts
│   └── LiveSession.ts
├── types/               # TypeScript types
├── middleware.ts        # Route protection
└── .env.example
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/signals` | List signals |
| POST | `/api/signals` | Create signal (admin) |
| POST | `/api/stripe/checkout` | Create checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users` | Update user plan/role |
| GET | `/api/admin/signals` | List all signals |
| POST | `/api/admin/signals` | Create signal |
| DELETE | `/api/admin/signals?id=` | Delete signal |

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Self-Hosted

```bash
npm run build
npm start
```

## Stripe Setup

1. Create products in Stripe Dashboard
2. Copy price IDs to `.env.local`
3. Add webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Copy webhook signing secret to `.env.local`

## License

MIT

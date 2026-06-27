# ReadyZo 🍛

> **Order food before you arrive. Skip the wait.**

ReadyZo is a mobile-first Progressive Web App (PWA) for rural and small-town hotels in India. Customers can pre-order food from nearby hotels and pick it up when they arrive — no waiting.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Custom UI + Radix UI primitives |
| Animations | Framer Motion |
| State | Zustand (with localStorage persistence) |
| Database | Prisma ORM + PostgreSQL (future integration) |
| PWA | next-pwa + Web Push Notifications |

## Color System

| Token | Color |
|---|---|
| Primary | `#6D28D9` (Purple) |
| Secondary | `#F97316` (Orange) |
| Background | `#FAFAFA` |
| Cards | `#FFFFFF` |

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server (accessible on your WiFi network)
npm run dev

# Open on this PC
http://localhost:3000
```

## Test on mobile + laptop (same WiFi)

The dev server binds to your network (`0.0.0.0`), so your phone can reach your PC.

1. Start the app: `npm run dev`
2. Find your PC IP (Windows): `ipconfig` → look for **IPv4** under Wi-Fi (e.g. `192.168.1.6`)
3. On your **phone** (same WiFi), open: `http://YOUR_PC_IP:3000`
4. On your **laptop**, open: `http://localhost:3000`

**Suggested test setup**

| Device | Flow | URL |
|--------|------|-----|
| Phone | Customer — browse hotels, place order | `http://YOUR_PC_IP:3000/customer` |
| Laptop | Hotel — login, accept orders | `http://localhost:3000/hotel/login` |

Orders sync across devices via the local API (polls every 3s). Demo hotel login: mobile `9876543210`, any password.

If the phone cannot connect, allow **Node.js** through Windows Firewall when prompted.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (Customer / Hotel cards)
│   ├── customer/
│   │   ├── page.tsx          # Hotel listing with search & filters
│   │   ├── hotel/[id]/       # Hotel detail + menu
│   │   ├── cart/             # Cart with customer info
│   │   └── order/[id]/       # Real-time order status
│   └── hotel/
│       ├── login/            # Hotel login
│       ├── register/         # Multi-step registration
│       ├── dashboard/        # Orders overview + stats
│       ├── orders/           # All orders with filter tabs
│       ├── orders/[id]/      # Order detail + action buttons
│       ├── menu/             # Category & product management
│       └── settings/         # Hotel profile & payment settings
├── components/
│   ├── ui/                   # Button, Input, Card, Dialog, Badge, etc.
│   ├── customer/             # HotelCard, ProductCard, CartBar
│   ├── hotel/                # OrderCard
│   └── shared/               # OrderStatusBadge, RatingStars
├── store/                    # Zustand stores (cart, orders, hotel)
├── data/                     # Mock data (6 hotels, 30+ products)
├── hooks/                    # useNotifications
├── lib/                      # utils (cn, formatCurrency, etc.)
└── types/                    # TypeScript interfaces & enums
prisma/
└── schema.prisma             # Full DB schema (Hotels, Products, Orders...)
```

## Customer Flow

1. Visit `/` → Choose "Order Food"
2. Browse hotels with search & category filters
3. Open a hotel → View menu by category → Add items to cart
4. Cart → Enter name & mobile → Select pickup time → Place Order
5. Track order status in real-time
6. When accepted → Pay via UPI QR → Tap "I Have Paid"
7. Hotel verifies → "Preparing" → "Ready" → Pick up!

## Hotel Flow

1. Register at `/hotel/register` (4-step wizard)
2. Login at `/hotel/login`
3. Dashboard → See today's revenue + order counts
4. Tap any order → Accept / Reject
5. If no UPI configured → Dialog prompts to add before accepting
6. Customer pays → Dashboard shows "Payment Submitted"
7. Verify in UPI app → "Payment Received" → Order moves to Preparing
8. "Mark Ready" → "Notify Customer" → "Complete Order"

## Demo Login

| Field | Value |
|---|---|
| Mobile | `9876543210` |
| Password | any password |

## Database Setup (for API integration)

```bash
# Copy env file
cp .env.example .env.local

# Add your PostgreSQL URL
DATABASE_URL="postgresql://user:pass@localhost:5432/readypa_db"

# Push schema to DB
npm run db:push

# Generate Prisma client
npm run db:generate
```

## PWA Features

- Installable on Android/iOS home screen
- Browser Push Notifications for order updates
- Works with slow connections (service worker caching)

## Future Roadmap

- Payment gateway integration (Razorpay/PhonePe)
- WhatsApp & SMS notifications
- Customer ratings & reviews
- Multiple branches per hotel
- Kitchen Display System (KDS)
- QR menu at tables
- Loyalty & coupons

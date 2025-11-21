# HEDDIEKITCHEN Frontend

## Overview
React + Vite frontend for HEDDIEKITCHEN e-commerce platform.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Icons**: Lucide React

## Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── stores/             # Zustand stores (auth, cart, ui)
│   ├── api/                # API client & services
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Setup

### Prerequisites
- Node.js 16+ / npm / yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=HEDDIEKITCHEN
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

## Key Features Implemented

### Components
- **Navbar**: Navigation with mobile menu
- **Loader**: Logo spinner for loading states
- **MenuItemCard**: Product card with image, price, rating
- **SkeletonLoader**: Placeholder while loading
- **Footer**: Site footer with links

### State Management (Zustand)
- `authStore`: User auth state
- `cartStore`: Shopping cart state
- `uiStore`: Global UI state (loading, spinner)

### API Services
- Authentication (register, login, logout)
- Menu (categories, items, reviews)
- Cart (add, remove, update, clear)
- Orders (create, track, history)
- Newsletter & Contact

## Pages To Build
- [ ] Homepage (hero, featured, testimonials)
- [ ] Menu page (filters, pagination)
- [ ] Meal Plans
- [ ] Event Catering
- [ ] Shipping
- [ ] About
- [ ] Contact
- [ ] Blog
- [ ] Authentication (login, register)
- [ ] Cart & Checkout
- [ ] Order tracking
- [ ] User profile

## Development Workflow

1. **Create page component** in `src/pages/`
2. **Add API calls** via `src/api/index.ts`
3. **Manage state** with Zustand stores
4. **Style** with Tailwind classes
5. **Use components** from `src/components/`
6. **Add route** in `src/App.tsx`

## Best Practices

- **Lazy load images** with srcset
- **Use Skeleton loaders** for async data
- **Store auth token** in localStorage
- **Handle errors** with try-catch
- **Validate forms** client-side
- **Responsive design** mobile-first
- **Accessible** with semantic HTML & ARIA
- **SEO** with meta tags

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel/Railway
```bash
npm run build
# Push to GitHub, connect to Vercel/Railway
```

## Troubleshooting

**Vite dev server slow**
- Clear `node_modules` and `package-lock.json`
- Run `npm install` again

**API not reachable**
- Check backend is running on `http://localhost:8000`
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in Django

**Tailwind not working**
- Ensure `index.css` includes `@tailwind` directives
- Check `tailwind.config.js` (if needed)

## Resources

- Vite: https://vitejs.dev/
- React: https://react.dev/
- TailwindCSS: https://tailwindcss.com/
- Zustand: https://github.com/pmndrs/zustand
- React Router: https://reactrouter.com/

---

**Version**: 1.0.0  
**Last Updated**: November 2024

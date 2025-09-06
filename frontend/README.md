# BMS — Frontend (Vite + React)

A clean, responsive dashboard to visualize battery telemetry.

## Highlights (UI/UX Principles)
- **Clarity first**: Large, legible type and spacious layout.
- **Progressive disclosure**: Minimal defaults; filters in a side panel for power users.
- **Feedback**: Skeleton loaders, toasts for errors/success.
- **Consistency**: Shared components, spacing scale, and semantic colors.
- **Accessibility**: Proper labels, keyboard navigation, ARIA where needed.
- **Mobile-first**: Stacks vertically on small screens.

## Quick Start
```
npm install
npm run dev
```
Set `VITE_API_URL` in `.env` to your backend:
```
VITE_API_URL=http://localhost:8080
```

Login using demo credentials (if you seeded):
- **Email**: demo@bms.dev
- **Password**: demo123

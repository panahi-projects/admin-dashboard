This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
admin-dashboard
├─ .prettierignore
├─ .prettierrc
├─ app
│  ├─ (protected)
│  │  └─ dashboard
│  │     ├─ data.json
│  │     ├─ layout.tsx
│  │     ├─ not-found.tsx
│  │     ├─ page.tsx
│  │     └─ [...slug]
│  │        └─ page.tsx
│  ├─ about
│  │  └─ page.tsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ route.ts
│  │  │  ├─ logout
│  │  │  │  └─ route.ts
│  │  │  ├─ me
│  │  │  │  └─ route.ts
│  │  │  ├─ refresh
│  │  │  │  └─ route.ts
│  │  │  └─ signup
│  │  │     └─ route.ts
│  │  ├─ products
│  │  │  └─ route.ts
│  │  └─ users
│  │     └─ route.ts
│  ├─ auth
│  │  └─ login
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ app-sidebar.tsx
│  ├─ auth
│  │  ├─ login-form.tsx
│  │  └─ logout-button.tsx
│  ├─ chart-area-interactive.tsx
│  ├─ dashboard
│  │  ├─ dinosaur-svg.tsx
│  │  └─ loading-spinner.tsx
│  ├─ data-table.tsx
│  ├─ nav-documents.tsx
│  ├─ nav-main.tsx
│  ├─ nav-secondary.tsx
│  ├─ nav-user.tsx
│  ├─ section-cards.tsx
│  ├─ site-header.tsx
│  └─ ui
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ sonner.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     └─ tooltip.tsx
├─ components.json
├─ configs
│  ├─ global.ts
│  ├─ public-routes.ts
│  └─ sidebar.ts
├─ eslint.config.mjs
├─ hooks
│  └─ use-mobile.ts
├─ lib
│  ├─ api-factory.ts
│  ├─ auth-db-utils.ts
│  ├─ auth-utils.ts
│  ├─ db-connect.ts
│  └─ utils.ts
├─ middleware.ts
├─ middlewares
│  ├─ alias-route-handler.ts
│  └─ protect-route-handler.ts
├─ models
│  └─ User.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ providers
│  ├─ auth-provider.tsx
│  └─ dashboard-provider.tsx
├─ public
│  ├─ assets
│  │  └─ images
│  │     ├─ avatar.jpg
│  │     └─ placeholder.svg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ services
│  └─ index.ts
├─ stores
│  └─ auth-store.ts
├─ tsconfig.json
├─ types
│  ├─ auth.ts
│  ├─ global.ts
│  ├─ index.ts
│  └─ sidebar.ts
└─ validations
   └─ auth-schema.ts

```

```
admin-dashboard
├─ .husky
│  ├─ pre-commit
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ .prettierignore
├─ .prettierrc
├─ app
│  ├─ (protected)
│  │  └─ dashboard
│  │     ├─ data.json
│  │     ├─ layout.tsx
│  │     ├─ not-found.tsx
│  │     ├─ page.tsx
│  │     └─ [...slug]
│  │        └─ page.tsx
│  ├─ about
│  │  └─ page.tsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ route.ts
│  │  │  ├─ logout
│  │  │  │  └─ route.ts
│  │  │  ├─ me
│  │  │  │  └─ route.ts
│  │  │  ├─ refresh
│  │  │  │  └─ route.ts
│  │  │  └─ signup
│  │  │     └─ route.ts
│  │  ├─ products
│  │  │  └─ route.ts
│  │  └─ users
│  │     └─ route.ts
│  ├─ auth
│  │  └─ login
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ app-sidebar.tsx
│  ├─ auth
│  │  ├─ login-form.tsx
│  │  └─ logout-button.tsx
│  ├─ chart-area-interactive.tsx
│  ├─ dashboard
│  │  ├─ dinosaur-svg.tsx
│  │  └─ loading-spinner.tsx
│  ├─ data-table.tsx
│  ├─ nav-documents.tsx
│  ├─ nav-main.tsx
│  ├─ nav-secondary.tsx
│  ├─ nav-user.tsx
│  ├─ section-cards.tsx
│  ├─ site-header.tsx
│  └─ ui
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ sonner.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     └─ tooltip.tsx
├─ components.json
├─ configs
│  ├─ global.ts
│  ├─ public-routes.ts
│  └─ sidebar.ts
├─ eslint.config.mjs
├─ hooks
│  └─ use-mobile.ts
├─ lib
│  ├─ api-factory.ts
│  ├─ auth-db-utils.ts
│  ├─ auth-utils.ts
│  ├─ db-connect.ts
│  └─ utils.ts
├─ middleware.ts
├─ middlewares
│  ├─ alias-route-handler.ts
│  └─ protect-route-handler.ts
├─ models
│  └─ User.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ providers
│  ├─ auth-provider.tsx
│  └─ dashboard-provider.tsx
├─ public
│  ├─ assets
│  │  └─ images
│  │     ├─ avatar.jpg
│  │     └─ placeholder.svg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ services
│  └─ index.ts
├─ stores
│  └─ auth-store.ts
├─ tsconfig.json
├─ types
│  ├─ auth.ts
│  ├─ global.ts
│  ├─ index.ts
│  └─ sidebar.ts
└─ validations
   └─ auth-schema.ts

```

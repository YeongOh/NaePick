This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```

├─ app
│  ├─ (auth)
│  │  └─ auth
│  │     ├─ edit
│  │     │  ├─ actions.ts
│  │     │  ├─ components
│  │     │  │  └─ EditUserForm.tsx
│  │     │  └─ page.tsx
│  │     ├─ login
│  │     │  ├─ actions.ts
│  │     │  ├─ components
│  │     │  │  └─ SigninForm.tsx
│  │     │  └─ page.tsx
│  │     ├─ signout
│  │     │  ├─ actions.ts
│  │     │  ├─ components
│  │     │  │  └─ SignoutForm.tsx
│  │     │  └─ page.tsx
│  │     └─ signup
│  │        ├─ action.ts
│  │        ├─ components
│  │        │  └─ SignupForm.tsx
│  │        └─ page.tsx
│  ├─ (error)
│  │  ├─ forbidden
│  │  │  └─ page.tsx
│  │  └─ layout.tsx
│  ├─ (search)
│  │  ├─ action.ts
│  │  ├─ category
│  │  │  ├─ page.tsx
│  │  │  └─ [category-name]
│  │  │     └─ page.tsx
│  │  ├─ components
│  │  │  └─ SearchMain.tsx
│  │  ├─ layout.tsx
│  │  └─ search
│  │     └─ page.tsx
│  ├─ (worldcups)
│  │  └─ wc
│  │     ├─ (manage)
│  │     │  ├─ components
│  │     │  │  ├─ WorldcupForm.tsx
│  │     │  │  └─ WorldcupFormTab.tsx
│  │     │  ├─ create
│  │     │  │  ├─ actions.ts
│  │     │  │  └─ page.tsx
│  │     │  ├─ edit
│  │     │  │  └─ [worldcup-id]
│  │     │  │     ├─ actions.ts
│  │     │  │     └─ page.tsx
│  │     │  └─ edit-candidates
│  │     │     └─ [worldcup-id]
│  │     │        ├─ actions.ts
│  │     │        ├─ components
│  │     │        │  ├─ EditCandidatesForm.tsx
│  │     │        │  ├─ EditImageButton.tsx
│  │     │        │  └─ EditVideoButton.tsx
│  │     │        └─ page.tsx
│  │     ├─ users
│  │     │  └─ [user-id]
│  │     │     ├─ actions.ts
│  │     │     └─ page.tsx
│  │     └─ [worldcup-id]
│  │        ├─ actions.ts
│  │        ├─ components
│  │        │  ├─ Comment.tsx
│  │        │  ├─ CommentDropdownMenu.tsx
│  │        │  ├─ CommentSection.tsx
│  │        │  ├─ WorldcupFold.tsx
│  │        │  ├─ WorldcupPickScreen.tsx
│  │        │  ├─ WorldcupStarter.tsx
│  │        │  └─ WorldcupStarterModal.tsx
│  │        ├─ page.tsx
│  │        ├─ stats
│  │        │  ├─ components
│  │        │  │  ├─ Dashboard.tsx
│  │        │  │  └─ DashboardRankingChart.tsx
│  │        │  └─ page.tsx
│  │        └─ utils.ts
│  ├─ components
│  │  ├─ card
│  │  │  ├─ card-dropdown-menu.tsx
│  │  │  ├─ card-ellipsis.tsx
│  │  │  ├─ card-grid-empty.tsx
│  │  │  ├─ card-grid-pagination.tsx
│  │  │  ├─ card-grid.tsx
│  │  │  ├─ card-thumbnail.tsx
│  │  │  ├─ card-update-link.tsx
│  │  │  └─ card.tsx
│  │  ├─ hooks
│  │  │  └─ useDropdown.tsx
│  │  ├─ main
│  │  │  ├─ index.tsx
│  │  │  └─ main-nav.tsx
│  │  ├─ media
│  │  │  └─ index.tsx
│  │  ├─ modal
│  │  │  ├─ delete-confirm-modal.tsx
│  │  │  └─ share-worldcup-modal.tsx
│  │  ├─ navbar
│  │  │  ├─ navbar-dropdown-menu.tsx
│  │  │  ├─ navbar-link.tsx
│  │  │  ├─ navbar-profile-image.tsx
│  │  │  └─ navbar.tsx
│  │  ├─ pagination
│  │  │  └─ index.tsx
│  │  ├─ ThumbnailImage
│  │  │  └─ index.tsx
│  │  └─ ui
│  │     ├─ Avatar
│  │     │  └─ index.tsx
│  │     ├─ button
│  │     │  └─ index.tsx
│  │     ├─ input
│  │     │  └─ index.tsx
│  │     ├─ input-error-message
│  │     │  └─ index.tsx
│  │     ├─ link-button
│  │     │  └─ index.tsx
│  │     ├─ my-image
│  │     │  └─ index.tsx
│  │     ├─ spinner
│  │     │  └─ index.tsx
│  │     ├─ textarea
│  │     │  └─ index.tsx
│  │     └─ toggleable-p
│  │        └─ index.tsx
│  ├─ constants
│  │  └─ index.ts
│  ├─ drizzle-seed
│  │  └─ route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ lib
│  │  ├─ analytics
│  │  │  └─ google.tsx
│  │  ├─ auth
│  │  │  ├─ service.ts
│  │  │  ├─ utils.ts
│  │  │  └─ validation.ts
│  │  ├─ candidate
│  │  │  └─ service.ts
│  │  ├─ category
│  │  │  └─ service.ts
│  │  ├─ comment
│  │  │  ├─ auth.ts
│  │  │  └─ service.ts
│  │  ├─ database
│  │  │  ├─ index.ts
│  │  │  └─ schema.ts
│  │  ├─ react-query
│  │  │  └─ index.tsx
│  │  ├─ session
│  │  │  └─ index.ts
│  │  ├─ storage
│  │  │  ├─ config.ts
│  │  │  └─ index.ts
│  │  ├─ types
│  │  │  └─ index.ts
│  │  ├─ videos
│  │  │  ├─ chzzk.ts
│  │  │  ├─ imgur.ts
│  │  │  └─ youtube.ts
│  │  └─ worldcup
│  │     ├─ auth.ts
│  │     └─ service.ts
│  ├─ not-found.tsx
│  ├─ page.tsx
│  └─ utils
│     ├─ date.ts
│     ├─ dayjs.ts
│     └─ index.ts
├─ drizzle.config.ts
├─ middleware.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
├─ README.md
├─ tailwind.config.ts
└─ tsconfig.json

```

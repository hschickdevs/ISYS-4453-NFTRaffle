## Remaining Tasks:

### Styling:
- [ ] Add a way to navigate between all of the pages 
- [ ] Style the pages to vaguely match the index.js page colors (or do new design alltogether)
- [ ] Add a dropdown on /create and /join that allows users to sort by raffle state (i.e. pending, active, ended)

### Backend:
- [ ] Disable Buttons on /create depending on cases (i.e. disable approve if already aproved, disable cancel if people have already entered, etc.)
- [ ] Show a user's raffles on page load on /create
- [ ] Add total tickets sold to and earnings estimate to /create so owner can view earnings
- [X] Add winner to the NFTRaffle smart contract and add this into the frontend
- [X] Fix issue with Metamask button greyed out

___

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

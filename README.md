# Sign-In with Ethereum Web App

This project is a simple Next.js web app that integrates Sign-In with Ethereum (SIWE) and allows the user to create and edit a profile.

You can check it out from here: https://ethereum-signin-eight.vercel.app/

## Project Setup

1. `git clone git@github.com:OmarBasem/ethereum-signin.git && cd ethereum-signin`
2. Add and setup .env file: 
```
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[db_name]?schema=public"
SESSION_SECRET="ADD_SESSION_SECRET"
```
3. Install packages: `yarn`
4. Run DB migrations: `npx prisma migrate dev`
5. Start next server: `yarn dev` 

## Unit Tests

The project included unit tests using vitest, and component tests using React Testing Library.

Tests are under `src/__tests__` and can be run using `yarn test`.

The `__tests__` directory follows the same structure of the `pages` directory.

## Design Choices

 - Next.js: a serverless architecture is sufficient for the requirements of this project. Next.js and React are used on the frontend
 with no backend. Pages router was used over app router as it good enough for this simple project.
 - Prisma: provides a type-safe and easy to use ORM for interacting with the database in TypeScript.
 - Ethers: needed to interact with an Ethereum wallet in the browser extension.
 - Iron-Session: for secure and stateless session management with cookies.

## Deployment

The project is deployed on Vercel, and the database is hosted on Supabase.

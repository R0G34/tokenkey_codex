# tokenkey.io

El presente de la inversión en el sector inmobiliario.

# Initialization

This project has been initialized with `yarn create next-app`.

# Configuration

> ℹ️ This is a **Next.js/Node.js** project. You do **not** need a Python virtual environment (`venv`) to run it.
> If you already created one, you can ignore/deactivate it and continue with one of the options below.

## Option A: run locally (installing tools on your PC)

You only need Node/Bun tooling (not Python tooling):

1. Install [nvm](https://github.com/nvm-sh/nvm) if you don't have it.
2. Use the project Node version:

```bash
nvm use
```

3. Install [Bun](https://bun.sh/docs/installation) (recommended package manager for this repo).
4. Install dependencies and run the app:

```bash
bun install
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Option B: run with Docker Compose (without installing Node/Bun on your PC)

If you prefer not to install Node/Bun locally, you can use the included compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Then open [http://localhost:3000](http://localhost:3000).

Notes:
- You still need Docker Desktop / Docker Engine installed.
- If your app needs environment variables, create a `.env.local` file before running compose.
- Stop the stack with `Ctrl+C` or run `docker compose -f docker-compose.dev.yml down` in another terminal.

This project uses [Tailwind CSS](https://tailwindcss.com/docs/installation) in combination with some plugins [ESLint](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues) and [Prettier](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) for formatting.

> 👋 VSCode/ESLint does not pick newly installed packages in the `node_modules` directory. After installing the packages for the first time, restart the VSCode workspace.

## Optional: isolate helper Python tooling with `venv`

If you personally want to use Python scripts/tools in this repository, you can create a virtual environment, but it is not required to run the web app:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

To leave the environment later:

```bash
deactivate
```

# CI

1. Commit rules:  
   • This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#why-use-conventional-commits) standard  
   • and [commitlint](https://github.com/conventional-changelog/commitlint#benefits-using-commitlint) executed in a husky hook to check them

```bash
# wrong example
git commit -m "add commitlint"
⏳   input: add commitlint
❌   subject may not be empty [subject-empty]
❌   type may not be empty [type-empty]
❌   found 2 problems, 0 warnings
ℹ️   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
husky - commit-msg hook exited with code 1 (error)
# good example
git commit -m "ci: add commitlint"
```

# Supabase

1. Login with your Personal Access Token

📖 https://supabase.com/docs/reference/cli/supabase-login

```zsh
npx supabase login
```

2. Generating TypeScript Types

📖 https://supabase.com/docs/guides/api/rest/generating-types

```zsh
npx supabase gen types typescript --project-id $PROJECT_REF > src/lib/supabase/database.types.ts
```

# shadcn/ui

The shadcn calendar component is not working with the latest version of react-day-picker: https://github.com/shadcn-ui/ui/issues/4366

In the meantime, we use this component:

- https://date-picker.luca-felix.com (source: https://github.com/shadcn-ui/ui/pull/4421)

## Carousel

https://shadcn-extension.vercel.app/docs/carousel

## Country Dropdown and Phone Input

https://shadcn-country-dropdown.vercel.app/

# removing eslint-plugin-tailwindcss not working with tailwind 4 on 2025-04-24

https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325
